import React, { useState, useEffect } from "react";
import { Conversion } from "../../types";
import { deleteConversion } from "../../services/convertService";
import CustomConfirmDialog from "./CustomConfirmDialog";
import { useTheme } from "../../context/ThemeContext";

interface MultiPageXmlViewerProps {
  conversion: Conversion | null;
  onDelete?: () => void;
}

export default function MultiPageXmlViewer({
  conversion,
  onDelete,
}: MultiPageXmlViewerProps) {
  const { isDarkMode } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [parsedXml, setParsedXml] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [displayMode, setDisplayMode] = useState<"structured" | "raw" | "xml">(
    "structured"
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (conversion?.xmlContent) {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          conversion.xmlContent,
          "text/xml"
        );
        setParsedXml(xmlDoc);

        const pages = xmlDoc.querySelectorAll("page");
        setTotalPages(pages.length);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to parse XML:", error);
      }
    } else {
      setParsedXml(null);
      setTotalPages(0);
      setCurrentPage(1);
    }
  }, [conversion]);

  if (!conversion) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex items-center justify-center">
        <div className="p-12 text-center">
          <div className="text-gray-300 dark:text-gray-600 text-5xl mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Select a conversion to view the XML
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    if (!conversion) return;

    navigator.clipboard.writeText(conversion.xmlContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!conversion) return;

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

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversion.id) return;

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

  const renderPageContent = () => {
    if (!parsedXml)
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            Unable to parse XML content
          </p>
        </div>
      );

    const pages = parsedXml.querySelectorAll("page");
    if (pages.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            No page content found in XML
          </p>
        </div>
      );
    }

    const page = pages[currentPage - 1];
    if (!page)
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Page not found</p>
        </div>
      );

    if (displayMode === "xml") {
      const serializer = new XMLSerializer();
      const pageXml = serializer.serializeToString(page);
      const formattedXml = formatXml(pageXml);

      return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
            {formattedXml}
          </pre>
        </div>
      );
    } else if (displayMode === "raw") {
      const rawContent = page.querySelector("rawContent")?.textContent || "";
      return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
            {rawContent}
          </pre>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Headers */}
        {Array.from(
          page.querySelectorAll("headers h1, headers h2, headers h3")
        ).map((header, idx) => {
          const level = header.nodeName.toLowerCase();
          const className =
            level === "h1"
              ? "text-2xl font-bold text-gray-900 dark:text-gray-100"
              : level === "h2"
              ? "text-xl font-bold text-gray-800 dark:text-gray-200"
              : "text-lg font-semibold text-gray-700 dark:text-gray-300";

          return (
            <div key={`header-${idx}`} className={className}>
              {header.textContent}
            </div>
          );
        })}

        {/* Paragraphs */}
        {Array.from(page.querySelectorAll("paragraphs p")).map((para, idx) => (
          <p
            key={`para-${idx}`}
            className="text-base text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {para.textContent}
          </p>
        ))}
      </div>
    );
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 truncate max-w-md">
            {conversion.fileName}
          </h2>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
            {totalPages} {totalPages === 1 ? "page" : "pages"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            {isCopied ? "Copied!" : "Copy"}
            <svg
              className="ml-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Download
            <svg
              className="ml-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
            <svg
              className="ml-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900 gap-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setDisplayMode("structured")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                displayMode === "structured"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              } ${
                displayMode === "structured"
                  ? "rounded-l-md"
                  : displayMode === "raw"
                  ? ""
                  : "rounded-l-md"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              PDF Content
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("raw")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                displayMode === "raw"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Raw Text
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("xml")}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${
                displayMode === "xml"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              XML Markup
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className="p-6 overflow-auto flex-grow"
        style={{ scrollbarGutter: "stable" }}
      >
        {renderPageContent()}
      </div>

      <CustomConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversion"
        message={`Are you sure you want to delete "${conversion.fileName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
}
