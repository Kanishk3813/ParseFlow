// src/components/dashboard/ConversionSection.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  convertPdfToXml,
  saveConversion,
  downloadXmlFile,
  copyXmlToClipboard,
} from "../../services/convertService";
import { Conversion } from "../../types";

interface ConversionSectionProps {
  onConversionComplete: () => void;
}

export default function ConversionSection({
  onConversionComplete,
}: ConversionSectionProps) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentConversion, setCurrentConversion] = useState<Conversion | null>(
    null
  );
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleConvert = async () => {
    if (!file || !user) return;

    setLoading(true);
    setError("");

    try {
      const { xml, pageCount } = await convertPdfToXml(file);

      const conversionId = await saveConversion(
        user.uid,
        file.name,
        xml,
        pageCount
      );

      setCurrentConversion({
        id: conversionId,
        userId: user.uid,
        fileName: file.name,
        xmlContent: xml,
        pageCount,
        createdAt: new Date(),
      });

      setFile(null);
      if (document.getElementById("fileInput") as HTMLInputElement) {
        (document.getElementById("fileInput") as HTMLInputElement).value = "";
      }

      onConversionComplete();
    } catch (error: any) {
      console.error("Conversion error:", error);
      setError(error.message || "Error during conversion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!currentConversion) return;

    const success = await copyXmlToClipboard(currentConversion.xmlContent);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } else {
      setError("Failed to copy to clipboard. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!currentConversion) return;
    downloadXmlFile(currentConversion.xmlContent, currentConversion.fileName);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <h2 className="text-xl font-bold mb-4">Upload PDF</h2>

        <div className="mb-4">
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Select PDF file:
          </label>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`block w-full text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      ${
                        isDarkMode
                          ? "file:bg-gray-700 file:text-blue-300 hover:file:bg-gray-600"
                          : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      }`}
          />
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded font-medium ${
            !file || loading
              ? `${
                  isDarkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-300 text-gray-500"
                } cursor-not-allowed`
              : `${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting...
            </span>
          ) : (
            "Convert to XML"
          )}
        </button>
      </div>

      {currentConversion && (
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-md overflow-hidden`}
        >
          <div
            className={`p-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b flex justify-between items-center`}
          >
            <h2 className="text-xl font-bold">Conversion Result</h2>
            <div className="space-x-2">
              <button
                onClick={handleCopy}
                className={`px-3 py-1 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded flex items-center`}
              >
                {copySuccess ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  "Copy Full XML"
                )}
              </button>
              <button
                onClick={handleDownload}
                className={`px-3 py-1 ${
                  isDarkMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                } text-white rounded flex items-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download XML
              </button>
            </div>
          </div>

          <div
            className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-3 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b`}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                File:
              </span>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {currentConversion.fileName}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div
              className={`mb-3 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <p>
                Your conversion has been saved. You can access it later from the
                Conversion History tab.
              </p>
              <p
                className={`mt-1 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-medium`}
              >
                This view shows the full XML document with all pages included.
              </p>
            </div>

            <div
              className={`${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } border-b mb-4`}
            >
              <nav className="-mb-px flex">
                <button
                  className={`${
                    isDarkMode
                      ? "border-blue-500 text-blue-400"
                      : "border-blue-500 text-blue-600"
                  } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
                >
                  Full XML
                </button>
              </nav>
            </div>

            <pre
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              } p-4 rounded overflow-x-auto text-sm max-h-96 border`}
            >
              {currentConversion.xmlContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
