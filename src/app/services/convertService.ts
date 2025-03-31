"use client";

import { collection, addDoc, query, where, getDocs, orderBy, Timestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Conversion } from "../types";

let pdfjsLib: any = null;

const initPdfjs = async () => {
  if (typeof window === 'undefined') return null;
  
  if (!pdfjsLib) {
    const pdfjs = await import('pdfjs-dist/webpack');
    pdfjsLib = pdfjs.default || pdfjs;
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

export const convertPdfToXml = async (file: File): Promise<string> => {
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
      
      let lastY: number | null = null;
      let currentParagraph: string[] = [];
      let paragraphs: string[] = [];
      let headers: { text: string, level: number }[] = [];
      
      const sortedItems = textContent.items.sort((a: any, b: any) => 
        b.transform[5] - a.transform[5]
      );
      
      const fontSizes = sortedItems
        .map((item: any) => item.height || 0)
        .filter((size: number) => size > 0);
      
      const avgFontSize = fontSizes.reduce((sum: number, size: number) => sum + size, 0) / 
        (fontSizes.length || 1);
      
      for (let j = 0; j < sortedItems.length; j++) {
        const item: any = sortedItems[j];
        const fontSize = item.height || 0;
        const text = item.str.trim();
        
        if (!text) continue;
        
        const isHeader = fontSize > avgFontSize * 1.2;
        
        const isNewParagraph = lastY !== null && 
          Math.abs(lastY - item.transform[5]) > 12;
        
        if (isNewParagraph && currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        
        if (isHeader) {
          const level = fontSize > avgFontSize * 1.5 ? 1 : 
                         fontSize > avgFontSize * 1.3 ? 2 : 3;
                         
          headers.push({ text, level });
        } else {
          currentParagraph.push(text);
        }
        
        lastY = item.transform[5];
      }
      
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
      }

      let pageXml = `<page number="${i}">`;
      
      if (headers.length > 0) {
        pageXml += `<headers>`;
        headers.forEach(header => {
          pageXml += `<h${header.level}>${escapeXml(header.text)}</h${header.level}>`;
        });
        pageXml += `</headers>`;
      }
      
      pageXml += `<paragraphs>`;
      paragraphs.forEach(paragraph => {
        pageXml += `<p>${escapeXml(paragraph)}</p>`;
      });
      pageXml += `</paragraphs>`;
      
      pageXml += `<rawContent><![CDATA[${
        sortedItems.map((item: any) => item.str).join(' ').replace(/]]>/g, ']]&gt;')
      }]]></rawContent>`;
      
      pageXml += `</page>`;
      allPageContents.push(pageXml);
    }
    
    function escapeXml(unsafe: string): string {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <info>
    <filename>${escapeXml(file.name)}</filename>
    <filesize>${file.size} bytes</filesize>
    <pages>${numPages}</pages>
    <author>${escapeXml(info.Author || 'Unknown')}</author>
    <creator>${escapeXml(info.Creator || 'Unknown')}</creator>
    <producer>${escapeXml(info.Producer || 'Unknown')}</producer>
  </info>
  <content>
    ${allPageContents.join('\n')}
  </content>
</document>`;
    
    return xml;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF. Please try again with a different file.");
  }
};

export const saveConversion = async (
  userId: string,
  fileName: string,
  xmlContent: string
): Promise<string> => {
  try {
    const conversionData: Conversion = {
      userId,
      fileName,
      xmlContent,
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

export const getUserConversions = async (userId: string): Promise<Conversion[]> => {
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
        createdAt: data.createdAt.toDate(),
      });
    });
    
    return conversions;
  } catch (error) {
    console.error("Error getting user conversions:", error);
    throw error;
  }
};