"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { convertPdfToXml, saveConversion } from "../../services/convertService";

interface FileUploadProps {
  onConversionComplete: () => void;
}

export default function FileUpload({ onConversionComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !user) {
      return;
    }
    
    setLoading(true);
    setError("");
    setProgress(10);
    
    try {
      setProgress(30);
      const xmlContent = await convertPdfToXml(file);
      
      setProgress(70);
      await saveConversion(user.uid, file.name, xmlContent);
      
      setProgress(100);
      setFile(null);
      onConversionComplete();
    } catch (error: any) {
      console.error("Conversion error:", error);
      setError(error.message || "Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Convert PDF to XML</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
            disabled={loading}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
        
        {loading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {progress < 30 && "Preparing..."}
              {progress >= 30 && progress < 70 && "Converting PDF to XML..."}
              {progress >= 70 && progress < 100 && "Saving conversion..."}
              {progress === 100 && "Complete!"}
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded focus:outline-none ${
            !file || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Converting..." : "Convert to XML"}
        </button>
      </form>
    </div>
  );
}