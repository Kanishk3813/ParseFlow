// src/app/page.tsx
"use client"

import React from "react";
import Link from "next/link";
import Header from "./components/layout/Header";
import ConversionVisualization from "../app/components/dashboard/visualization";
import { ArrowUpRight, CheckCircle, FileText, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Simple • Fast • Accurate
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                ParseFlow
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Transform your PDF documents into structured XML format with precision. 
                Preserve hierarchies, tables, and formatting for seamless data extraction and integration.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
                >
                  Get Started
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium text-lg hover:bg-gray-50 transition"
                >
                  See Demo
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <ConversionVisualization />
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-16 bg-white rounded-xl shadow-sm max-w-5xl mx-auto mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Structure Preservation</h3>
                <p className="text-gray-600">
                  Maintain document hierarchy, tables, lists, and formatting during conversion.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
                <p className="text-gray-600">
                  Your documents are encrypted and automatically deleted after processing.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rapid Conversion</h3>
                <p className="text-gray-600">
                  Fast processing engine converts even complex documents in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 w-10 h-10 rounded-full text-blue-600 font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Upload PDF</h3>
                <p className="text-gray-600">
                  Simply upload your PDF document through our secure interface.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 w-10 h-10 rounded-full text-blue-600 font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-gray-600">
                  Our engine analyzes the document structure and content.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="inline-flex items-center justify-center bg-blue-100 w-10 h-10 rounded-full text-blue-600 font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Get XML</h3>
                <p className="text-gray-600">
                  Download the converted XML or copy directly to clipboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This tool has saved me countless hours of manual data extraction. The XML output 
                maintains all the structural elements I need for my analysis pipeline."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">AS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Alice Smith</h4>
                  <p className="text-sm text-gray-500">Document Manager</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The accuracy of this converter is impressive. It correctly handles complex tables
                and nested structures that other tools couldn't process."
              </p>
            </div>
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto text-center py-12 px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Convert Your Documents?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust our tool for their document conversion needs.
          </p>
          
          <Link
            href="/auth"
            className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-8 rounded-lg font-medium text-lg hover:bg-blue-700 transition"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
          
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Free tier available
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}