// src/components/dashboard/HistorySection.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getUserConversions,
  deleteConversion,
} from "../../services/convertService";
import { Conversion } from "../../types";

interface HistorySectionProps {
  refreshTrigger: number;
  onConversionComplete: () => void;
}

export default function HistorySection({
  refreshTrigger,
  onConversionComplete,
}: HistorySectionProps) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConversion, setSelectedConversion] =
    useState<Conversion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayMode, setDisplayMode] = useState<"pdf" | "xml">("xml");
  const [parsedXml, setParsedXml] = useState<Document | null>(null);

  useEffect(() => {
    const fetchConversions = async () => {
      if (!user) return;

      setLoading(true);
      setError("");

      try {
        const userConversions = await getUserConversions(user.uid);
        setConversions(userConversions);
      } catch (error: any) {
        console.error("Error fetching conversions:", error);
        setError("Failed to load your conversions. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversions();
  }, [user, refreshTrigger]);

  useEffect(() => {
    if (selectedConversion?.xmlContent) {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          selectedConversion.xmlContent,
          "text/xml"
        );
        setParsedXml(xmlDoc);
      } catch (error) {
        console.error("Failed to parse XML:", error);
        setParsedXml(null);
      }
    } else {
      setParsedXml(null);
    }
  }, [selectedConversion]);

  const handleDelete = async (id: string) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this conversion? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await deleteConversion(id);

      setConversions(conversions.filter((conv) => conv.id !== id));

      if (selectedConversion && selectedConversion.id === id) {
        setSelectedConversion(null);
      }

      onConversionComplete();
    } catch (error) {
      alert("Failed to delete conversion. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    if (!selectedConversion) return;

    navigator.clipboard.writeText(selectedConversion.xmlContent);
    alert("XML copied to clipboard!");
  };

  const handleDownload = () => {
    if (!selectedConversion) return;

    const blob = new Blob([selectedConversion.xmlContent], {
      type: "text/xml",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedConversion.fileName.replace(".pdf", ".xml");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const extractPdfContent = (xmlDoc: Document | null): string => {
    if (!xmlDoc) return "No content available";

    const pages = xmlDoc.querySelectorAll("page");
    let content = "";

    pages.forEach((page, pageIndex) => {
      content += `\n--- Page ${pageIndex + 1} ---\n\n`;

      const headers = page.querySelectorAll(
        "headers h1, headers h2, headers h3"
      );
      headers.forEach((header) => {
        content += `${header.nodeName}: ${header.textContent}\n`;
      });

      const paragraphs = page.querySelectorAll("paragraphs p");
      paragraphs.forEach((para) => {
        content += `${para.textContent}\n\n`;
      });
    });

    return content || "No content extracted";
  };

  const formatXml = (xml: string): string => {
    let formatted = "";
    let indent = "";
    const tab = "  ";

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }

      formatted += indent + "<" + node + ">\n";

      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("!--")) {
        indent += tab;
      }
    });

    return formatted
      .substring(1, formatted.length - 2)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  };

  if (loading) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDarkMode ? "border-blue-400" : "border-blue-500"
            }`}
          ></div>
          <span className="ml-2">Loading your conversions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <div className="text-center py-4 text-red-500">{error}</div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <div
          className={`text-center py-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <p className="mb-2">No conversions found.</p>
          <p>Go to the Convert New PDF tab to create your first conversion.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div
          className={`${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-md overflow-hidden`}
        >
          <h2
            className={`text-xl font-bold p-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            } border-b`}
          >
            Your Conversions
          </h2>
          <ul
            className={`divide-y ${
              isDarkMode ? "divide-gray-700" : "divide-gray-200"
            } max-h-96 overflow-y-auto`}
          >
            {conversions.map((conversion) => (
              <li
                key={conversion.id}
                onClick={() => setSelectedConversion(conversion)}
                className={`p-4 ${
                  selectedConversion?.id === conversion.id
                    ? isDarkMode
                      ? "bg-blue-900"
                      : "bg-blue-50"
                    : ""
                } ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } cursor-pointer transition`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium truncate"
                      title={conversion.fileName}
                    >
                      {conversion.fileName}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {new Date(conversion.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (conversion.id) handleDelete(conversion.id);
                    }}
                    disabled={isDeleting}
                    className={`ml-2 ${
                      isDarkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-500 hover:text-red-700"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedConversion ? (
          <div
            className={`${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-md overflow-hidden`}
          >
            <div
              className={`p-4 ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              } border-b flex justify-between items-center flex-wrap gap-2`}
            >
              <h2
                className="text-xl font-bold truncate flex-1"
                title={selectedConversion.fileName}
              >
                {selectedConversion.fileName}
              </h2>

              <div className="flex gap-2">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setDisplayMode("pdf")}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md ${
                      displayMode === "pdf"
                        ? isDarkMode
                          ? "bg-blue-900 text-blue-300 border border-blue-700"
                          : "bg-blue-50 text-blue-700 border border-blue-300"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    PDF Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode("xml")}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md ${
                      displayMode === "xml"
                        ? isDarkMode
                          ? "bg-blue-900 text-blue-300 border border-blue-700"
                          : "bg-blue-50 text-blue-700 border border-blue-300"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    XML Markup
                  </button>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded text-sm`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className={`px-3 py-1.5 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white rounded text-sm`}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {
                      if (selectedConversion.id)
                        handleDelete(selectedConversion.id);
                    }}
                    disabled={isDeleting}
                    className={`px-3 py-1.5 ${
                      isDarkMode
                        ? "bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:text-red-300"
                        : "bg-red-500 hover:bg-red-600 disabled:bg-red-300"
                    } text-white rounded text-sm`}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {displayMode === "xml" ? (
                <pre
                  className={`${
                    isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50"
                  } p-4 rounded overflow-x-auto text-sm max-h-96 font-mono`}
                >
                  {formatXml(selectedConversion.xmlContent)}
                </pre>
              ) : (
                <pre
                  className={`${
                    isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50"
                  } p-4 rounded overflow-x-auto text-sm max-h-96`}
                >
                  {extractPdfContent(parsedXml)}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`${
              isDarkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-white text-gray-500"
            } p-6 rounded-lg shadow-md text-center`}
          >
            Select a conversion from the list to view the XML
          </div>
        )}
      </div>
    </div>
  );
}
