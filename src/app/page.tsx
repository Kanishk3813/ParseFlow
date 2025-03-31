// src/app/page.tsx
import React from "react";
import Link from "next/link";
import Header from "./components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">PDF to XML Converter</h1>
          <p className="text-xl text-gray-600 mb-8">
            Convert your PDF documents to structured XML format with ease.
            Preserve document structure and formatting for better data extraction.
          </p>
          
          <Link
            href="/auth"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}