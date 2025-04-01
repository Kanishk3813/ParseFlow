// src/app/components/dashboard/ConversionList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserConversions, downloadXmlFile, copyXmlToClipboard } from "../../services/convertService";
import { Conversion } from "../../types";

interface ConversionListProps {
  refreshTrigger: number;
  onSelectConversion: (conversion: Conversion) => void;
}

export default function ConversionList({
  refreshTrigger,
  onSelectConversion,
}: ConversionListProps) {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedSchema, setSelectedSchema] = useState('basic-document');

  useEffect(() => {
    const fetchConversions = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const userConversions = await getUserConversions(user.uid);
        setConversions(userConversions);
      } catch (error) {
        console.error("Error fetching conversions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversions();
  }, [user, refreshTrigger]);

  const handleCopy = async (conversion: Conversion, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click
    
    try {
      const success = await copyXmlToClipboard(conversion.xmlContent);
      if (success) {
        setCopySuccess(conversion.id || "success");
        setTimeout(() => setCopySuccess(null), 2000);
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleDownload = (conversion: Conversion, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click
    downloadXmlFile(conversion.xmlContent, conversion.fileName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading conversions...</span>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mb-2">No conversions found.</p>
        <p>Convert your first PDF to XML.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold p-4 border-b flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Your Conversions
      </h2>
      <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {conversions.map((conversion) => (
          <li
            key={conversion.id}
            className="hover:bg-gray-50 cursor-pointer transition"
            onClick={() => onSelectConversion(conversion)}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-blue-700 truncate max-w-xs" title={conversion.fileName}>
                  {conversion.fileName}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleCopy(conversion, e)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Copy XML to clipboard"
                  >
                    {copySuccess === conversion.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDownload(conversion, e)}
                    className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                    title="Download XML file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(conversion.createdAt).toLocaleString()}</span>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                  Click to view
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}