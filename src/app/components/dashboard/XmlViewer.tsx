"use client";

import React, { useState } from "react";
import { Conversion } from "../../types";
import { deleteConversion } from "../../services/convertService";

interface XmlViewerProps {
  conversion: Conversion | null;
  onDelete?: () => void;
}

export default function XmlViewer({ conversion, onDelete }: XmlViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!conversion) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Select a conversion to view the XML
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(conversion.xmlContent);
    alert("XML copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([conversion.xmlContent], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = conversion.fileName.replace(".pdf", ".xml");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!conversion.id) return;
    
    const confirmDelete = window.confirm("Are you sure you want to delete this conversion? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await deleteConversion(conversion.id);
      if (onDelete) onDelete();
    } catch (error) {
      alert("Failed to delete conversion. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">{conversion.fileName}</h2>
        <div className="space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
          {conversion.xmlContent}
        </pre>
      </div>
    </div>
  );
}