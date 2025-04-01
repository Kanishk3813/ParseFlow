// src/app/types/pdf-parse.d.ts
declare module 'pdfjs-dist/build/pdf.worker.entry';

declare module 'pdfjs-dist/webpack' {
    const pdfjs: any;
    export default pdfjs;
  }
  
  
declare module 'pdf-parse' {
    interface PDFInfo {
      Author?: string;
      Creator?: string;
      Producer?: string;
      [key: string]: any;
    }
  
    interface PDFData {
      text: string;
      numpages: number;
      numrender: number;
      info: PDFInfo;
      metadata: any;
      version: string;
    }
  
    function pdfParse(
      dataBuffer: Buffer, 
      options?: {
        pagerender?: (pageData: any) => string;
        max?: number;
        version?: string;
      }
    ): Promise<PDFData>;
  
    export = pdfParse;
  }
  