"use client";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Conversion } from "../types";

let pdfjsLib: any = null;

declare module "pdfjs-dist/build/pdf.worker.entry";

const initPdfjs = async () => {
  if (typeof window === "undefined") return null;

  if (!pdfjsLib) {
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjsLib = pdfjs;

      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    } catch (error) {
      console.error("Error initializing PDF.js:", error);
      throw new Error("Failed to initialize PDF processing library.");
    }
  }

  return pdfjsLib;
};

export const deleteConversion = async (conversionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "conversions", conversionId));
  } catch (error) {
    console.error("Error deleting conversion:", error);
    throw new Error("Failed to delete conversion. Please try again.");
  }
};

export async function convertPdfToXml(file: File, xsdSchema?: string) {
  try {
    const pdfjs = await initPdfjs();
    if (!pdfjs) {
      throw new Error("Failed to initialize PDF.js");
    }

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const metadata = await pdf.getMetadata().catch(() => ({ info: {} }));
    const info = metadata.info || {};

    const numPages = pdf.numPages;
    let allPageContents = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });

      const textItems = textContent.items.map((item: any) => {
        let x = item.transform[4] || 0;
        let y = item.transform[5] || 0;

        if (pdfjs.Util && pdfjs.Util.transform) {
          const tx = pdfjs.Util.transform(
            pdfjs.Util.transform(viewport.transform, item.transform),
            [1, 0, 0, -1, 0, 0]
          );
          x = tx[4];
          y = viewport.height - tx[5];
        }

        return {
          text: item.str,
          x: x,
          y: y,
          width: item.width || 0,
          height: item.height || 0,
          fontName: item.fontName,
          hasEOL: item.hasEOL || false,
        };
      });

      const sortedItems = textItems.sort((a: any, b: any) => {
        const yDiff = Math.abs(a.y - b.y);
        if (yDiff < 5) {
          return a.x - b.x;
        }
        return a.y - b.y;
      });

      const lines: any[] = [];
      let currentLine: any[] = [];
      let lastY: number | null = null;

      sortedItems.forEach((item: any) => {
        if (lastY === null || Math.abs(item.y - lastY) < 5) {
          currentLine.push(item);
        } else {
          if (currentLine.length > 0) {
            currentLine.sort((a, b) => a.x - b.x);
            lines.push([...currentLine]);
          }
          currentLine = [item];
        }
        lastY = item.y;
      });

      if (currentLine.length > 0) {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push(currentLine);
      }

      const paragraphs: string[] = [];
      const headers: { text: string; level: number }[] = [];

      const fontSizes = sortedItems
        .map((item: any) => item.height)
        .filter((size: number) => size > 0);

      const avgFontSize =
        fontSizes.reduce((sum: number, size: number) => sum + size, 0) /
        (fontSizes.length || 1);

      const sortedFontSizes = [...fontSizes].sort((a, b) => b - a);
      const topFontSizes = sortedFontSizes.slice(
        0,
        Math.min(10, sortedFontSizes.length)
      );

      const h1Threshold = avgFontSize * 1.5;
      const h2Threshold = avgFontSize * 1.2;

      let currentParagraph: string[] = [];
      let inParagraph = false;

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const lineText = line
          .map((item: any) => item.text)
          .join(" ")
          .trim();

        if (!lineText) continue;

        const largestFont = Math.max(...line.map((item: any) => item.height));
        const isHeader = largestFont > h2Threshold;

        if (isHeader) {
          if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(" "));
            currentParagraph = [];
          }

          const level = largestFont > h1Threshold ? 1 : 2;
          headers.push({ text: lineText, level });
          inParagraph = false;
        } else {
          const nextLine = j + 1 < lines.length ? lines[j + 1] : null;
          const isListItem = lineText.match(/^[\s•\-\*\d]+[.)]\s/);
          const isPossibleListItem =
            lineText.match(/^[⚫•◦○♦⬤▪▫◆◇■□●○]\s/) ||
            lineText.match(/^[\s]*[\d]+[.)]\s/);

          if (isListItem || isPossibleListItem) {
            if (currentParagraph.length > 0) {
              paragraphs.push(currentParagraph.join(" "));
              currentParagraph = [];
            }
            paragraphs.push(lineText);
            inParagraph = false;
          } else if (
            lineText.length < 5 ||
            lineText.match(/^[A-Z][a-z]*:/) ||
            (nextLine &&
              Math.abs(line[0].y - nextLine[0].y) > avgFontSize * 1.5)
          ) {
            if (currentParagraph.length > 0) {
              currentParagraph.push(lineText);
              paragraphs.push(currentParagraph.join(" "));
              currentParagraph = [];
            } else {
              paragraphs.push(lineText);
            }
            inParagraph = false;
          } else {
            currentParagraph.push(lineText);
            inParagraph = true;
          }
        }
      }

      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
      }

      let pageXml = `<page number="${i}">`;

      if (headers.length > 0) {
        pageXml += `<headers>`;
        headers.forEach((header) => {
          pageXml += `<h${header.level}>${escapeXml(header.text)}</h${
            header.level
          }>`;
        });
        pageXml += `</headers>`;
      }

      pageXml += `<paragraphs>`;
      paragraphs.forEach((paragraph) => {
        const cleanedParagraph = paragraph
          .replace(/\s+/g, " ")
          .replace(/[\u2028\u2029]/g, " ")
          .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g, " ")
          .trim();

        if (cleanedParagraph) {
          pageXml += `<p>${escapeXml(cleanedParagraph)}</p>`;
        }
      });
      pageXml += `</paragraphs>`;

      const rawContent = sortedItems
        .map((item: any) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .replace(/]]>/g, "]]&gt;")
        .trim();

      pageXml += `<rawContent><![CDATA[${rawContent}]]></rawContent>`;

      pageXml += `</page>`;
      allPageContents.push(pageXml);
    }

    function escapeXml(unsafe: string): string {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <info>
    <filename>${escapeXml(file.name)}</filename>
    <filesize>${file.size} bytes</filesize>
    <pages>${numPages}</pages>
    <author>${escapeXml(info.Author || "Unknown")}</author>
    <creator>${escapeXml(info.Creator || "Unknown")}</creator>
    <producer>${escapeXml(info.Producer || "Unknown")}</producer>
    <conversionDate>${new Date().toISOString()}</conversionDate>
  </info>
  <content>
    ${allPageContents.join("\n    ")}
  </content>
</document>`;

    return { xml, pageCount: numPages };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      "Failed to parse PDF. Please try again with a different file."
    );
  }
}

export const downloadXmlFile = (xmlContent: string, fileName: string): void => {
  const blob = new Blob([xmlContent], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.replace(/\.[^/.]+$/, "") + ".xml";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

export const copyXmlToClipboard = async (
  xmlContent: string
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(xmlContent);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

export const saveConversion = async (
  userId: string,
  fileName: string,
  xmlContent: string,
  pageCount: number
): Promise<string> => {
  try {
    const conversionData: Conversion = {
      userId,
      fileName,
      xmlContent,
      pageCount,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "conversions"), {
      ...conversionData,
      createdAt: Timestamp.fromDate(conversionData.createdAt),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error saving conversion:", error);
    throw error;
  }
};

export const getUserConversions = async (
  userId: string
): Promise<Conversion[]> => {
  try {
    const q = query(
      collection(db, "conversions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const conversions: Conversion[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conversions.push({
        id: doc.id,
        userId: data.userId,
        fileName: data.fileName,
        xmlContent: data.xmlContent,
        pageCount: data.pageCount || 0,
        createdAt: data.createdAt.toDate(),
      });
    });

    return conversions;
  } catch (error) {
    console.error("Error getting user conversions:", error);
    throw error;
  }
};
