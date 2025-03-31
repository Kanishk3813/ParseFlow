"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getUserConversions } from "../services/convertService";
import { Conversion } from "../types";
import Header from "../components/layout/Header";
import FileUpload from "../components/dashboard/FileUpload";
import MultiPageXmlViewer from "../components/dashboard/XmlViewer";


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'convert' | 'history'>('convert');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchConversions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userConversions = await getUserConversions(user.uid);
        setConversions(userConversions);
        
        if (userConversions.length > 0 && !selectedConversion && activeTab === 'history') {
          setSelectedConversion(userConversions[0]);
        }
      } catch (error) {
        console.error("Error fetching conversions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversions();
  }, [user, refreshTrigger, activeTab]);

  const handleTabChange = (tab: 'convert' | 'history') => {
    if (tab === 'convert') {
      setSelectedConversion(null);
    }
    setActiveTab(tab);
  };

  const handleConversionComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('history');
  };

  const handleDelete = () => {
    setSelectedConversion(null);
    handleConversionComplete();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-800 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`md:w-72 bg-white border-r border-gray-100 flex-shrink-0
              ${showSidebar ? 'block' : 'hidden md:block'}`}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">PDF to XML</h2>
              <p className="text-gray-500 text-sm mt-1">Convert and manage your documents</p>
            </div>
            
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => handleTabChange('convert')}
                className={`flex-1 py-4 text-center font-medium transition-colors duration-200
                  ${activeTab === 'convert' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                Convert
              </button>
              <button
                onClick={() => handleTabChange('history')}
                className={`flex-1 py-4 text-center font-medium transition-colors duration-200
                  ${activeTab === 'history' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                History
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {activeTab === 'convert' ? (
               <div className="space-y-6 px-2">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center"
               >
                 <div className="mb-5 p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                   <svg
                     className="w-10 h-10 text-blue-600"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth="1.5"
                       d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                     />
                   </svg>
                 </div>
             
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Conversion Guide</h3>
                 <p className="text-gray-600 text-sm text-center mb-6">
                   Drag any PDF document to the main area for instant XML conversion while preserving structure.
                 </p>
             
                 <div className="w-full space-y-4">
                   <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex-shrink-0 mt-0.5 mr-3 text-blue-500">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                       </svg>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-800">Simple Upload</p>
                       <p className="text-xs text-gray-500 mt-1">Supported files: PDF (max 50MB)</p>
                     </div>
                   </div>
             
                   <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex-shrink-0 mt-0.5 mr-3 text-blue-500">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-800">Instant Processing</p>
                       <p className="text-xs text-gray-500 mt-1">Typical conversion time: &lt;5s</p>
                     </div>
                   </div>
             
                   <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex-shrink-0 mt-0.5 mr-3 text-blue-500">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                       </svg>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-800">Secure Handling</p>
                       <p className="text-xs text-gray-500 mt-1">Files deleted automatically after 24h</p>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Recent Conversions</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : conversions.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="mt-2">No conversions yet</p>
                      <button
                        onClick={() => handleTabChange('convert')}
                        className="mt-3 text-sm text-blue-500 hover:text-blue-600"
                      >
                        Convert your first PDF
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <ul className="space-y-2">
                        {conversions.map((conversion, index) => (
                          <motion.li 
                            key={conversion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            onClick={() => setSelectedConversion(conversion)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedConversion?.id === conversion.id 
                                ? 'bg-blue-50 border border-blue-100' 
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <div className="overflow-hidden">
                                <h4 className="font-medium text-gray-800 truncate" title={conversion.fileName}>
                                  {conversion.fileName}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {new Date(conversion.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 p-6 overflow-y-auto"
            style={{ maxHeight: '100vh' }}
          >
            <div className="md:hidden mb-4 flex items-center justify-between">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                {showSidebar ? 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  : 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                }
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'convert' ? 'Convert PDF' : 'Conversion History'}
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              {activeTab === 'convert' ? (
                <motion.div
                  key="convert"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center max-w-lg mx-auto py-6"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full inline-flex mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">PDF to XML Converter</h1>
                  <p className="text-gray-600 mb-8">
                    Upload your PDF documents and convert them to structured XML format with preserved formatting and content structure.
                  </p>
                  
                  <FileUpload onConversionComplete={handleConversionComplete} />
                </motion.div>
              ) : selectedConversion ? (
                <motion.div
                  key="viewer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MultiPageXmlViewer 
                    conversion={selectedConversion} 
                    onDelete={handleDelete}
                  />
                </motion.div>
              ) : conversions.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center max-w-lg mx-auto py-12"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full inline-flex mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Conversions Yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't converted any PDF files yet. Start by converting your first document.
                  </p>
                  <button
                    onClick={() => handleTabChange('convert')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
                  >
                    Convert Your First PDF
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="selectPrompt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-full text-center"
                >
                  <div className="max-w-md">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                    </svg>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Select a Conversion</h3>
                    <p className="text-gray-500">
                      Choose a conversion from the history panel to view its details and XML content.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}