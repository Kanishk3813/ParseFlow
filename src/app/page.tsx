// src/app/page.tsx
"use client"

import React from "react";
import Link from "next/link";
import Header from "./components/layout/Header";
import ConversionVisualization from "../app/components/dashboard/visualization";
import { ArrowUpRight, CheckCircle, FileText, Shield, Clock } from "lucide-react";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                Simple • Fast • Accurate
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                ParseFlow
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Transform your PDF documents into structured XML format with precision. 
                Preserve hierarchies, tables, and formatting for seamless data extraction and integration.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                  Get Started
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-lg font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  See Demo
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <ConversionVisualization />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-5xl mx-auto mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Structure Preservation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Maintain document hierarchy, tables, lists, and formatting during conversion.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="text-green-600 dark:text-green-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your documents are encrypted and automatically deleted after processing.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="text-purple-600 dark:text-purple-400 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Rapid Conversion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Fast processing engine converts even complex documents in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 w-10 h-10 rounded-full text-blue-600 dark:text-blue-400 font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Upload PDF</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply upload your PDF document through our secure interface.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 w-10 h-10 rounded-full text-blue-600 dark:text-blue-400 font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">AI Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our engine analyzes the document structure and content.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 w-10 h-10 rounded-full text-blue-600 dark:text-blue-400 font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Get XML</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download the converted XML or copy directly to clipboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">What Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/40 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">John Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "This tool has saved me countless hours of manual data extraction. The XML output 
                maintains all the structural elements I need for my analysis pipeline."
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/40 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 dark:text-green-400 font-medium">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">Alice Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Document Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The accuracy of this converter is impressive. It correctly handles complex tables
                and nested structures that other tools couldn't process."
              </p>
            </div>
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto text-center py-12 px-4">
          <h2 className="text-3xl font-bold mb-6 dark:text-white">Ready to Convert Your Documents?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our tool for their document conversion needs.
          </p>
          
          <Link
            href="/auth"
            className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white py-3 px-8 rounded-lg font-medium text-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
          
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
              Free tier available
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
              Cancel anytime
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}