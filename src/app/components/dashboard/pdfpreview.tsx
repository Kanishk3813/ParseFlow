// src/components/PdfPreview.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  file: File | string;
  scale?: number;
}

export default function PdfPreview({ file, scale = 1.5 }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      let pdfData;
      if (typeof file === 'string') {
        pdfData = await pdfjs.getDocument(file).promise;
      } else {
        const arrayBuffer = await file.arrayBuffer();
        pdfData = await pdfjs.getDocument(arrayBuffer).promise;
      }
      
      setPdf(pdfData);
      setNumPages(pdfData.numPages);
    };

    loadPdf();
  }, [file]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context!,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <canvas ref={canvasRef} className="mb-4 mx-auto shadow-sm" />
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-600">
          Page {currentPage} of {numPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
          disabled={currentPage === numPages}
          className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}