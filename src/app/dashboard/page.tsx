// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import ConversionSection from "../components/dashboard/ConversionSection";
import HistorySection from "../components/dashboard/HistorySection";
import { Conversion } from "../types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'convert' | 'history'>('convert');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleConversionComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">PDF to XML Converter</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'convert'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('convert')}
          >
            Convert New PDF
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Conversion History
          </button>
        </div>
        
        {activeTab === 'convert' ? (
          <ConversionSection onConversionComplete={handleConversionComplete} />
        ) : (
          <HistorySection refreshTrigger={refreshTrigger} onConversionComplete={handleConversionComplete} />
        )}
      </main>
    </div>
  );
}