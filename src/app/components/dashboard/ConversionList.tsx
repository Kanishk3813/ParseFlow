// src/app/components/dashboard/ConversionList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserConversions } from "../../services/convertService";
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
  const { user } = useAuth();

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

  if (loading) {
    return <div className="text-center py-4">Loading conversions...</div>;
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No conversions found. Convert your first PDF to XML.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold p-4 border-b">Your Conversions</h2>
      <ul className="divide-y divide-gray-200">
        {conversions.map((conversion) => (
          <li
            key={conversion.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => onSelectConversion(conversion)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{conversion.fileName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(conversion.createdAt).toLocaleString()}
                </p>
              </div>
              <span className="text-blue-500">View</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}