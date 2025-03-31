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
    let allPageTexts = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let textItems: any[] = [];
      let currentLine: string[] = [];
      
      textContent.items.forEach((item: any) => {
        if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
          if (currentLine.length > 0) {
            textItems.push(currentLine.join(' '));
            currentLine = [];
          }
          
          if (Math.abs(lastY - item.transform[5]) > 12) {
            textItems.push('');
          }
        }
        
        currentLine.push(item.str);
        lastY = item.transform[5];
      });
      
      if (currentLine.length > 0) {
        textItems.push(currentLine.join(' '));
      }
      
      const pageText = textItems.join('\n');
      allPageTexts.push(pageText);
    }
    
    const fullText = allPageTexts.join('\n\n--- Page Break ---\n\n');
    
    const safeText = fullText.replace(/]]>/g, ']]&gt;');
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <info>
    <filename>${file.name}</filename>
    <filesize>${file.size} bytes</filesize>
    <pages>${numPages}</pages>
    <author>${info.Author || 'Unknown'}</author>
    <creator>${info.Creator || 'Unknown'}</creator>
    <producer>${info.Producer || 'Unknown'}</producer>
  </info>
  <content>
    <text><![CDATA[${safeText}]]></text>
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