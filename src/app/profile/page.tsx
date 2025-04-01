// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../app/context/AuthContext";
import ProfilePage from "../../app/components/dashboard/Profile";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../app/firebase/config";

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    totalConversions?: number;
    totalPages?: number;
    lastConversion?: Date;
    conversionHistory?: Array<{ date: string; count: number }>;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const conversionsQuery = query(
          collection(db, "conversions"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(conversionsQuery);
        const conversions = querySnapshot.docs.map((doc) => doc.data());

        const totalConversions = conversions.length;
        const totalPages = conversions.reduce(
          (sum, conv) => sum + (conv.pageCount || 0),
          0
        );
        const lastConversion =
          conversions.length > 0
            ? conversions
                .reduce((latest, conv) =>
                  conv.createdAt.toDate() > latest.createdAt.toDate()
                    ? conv
                    : latest
                )
                .createdAt.toDate()
            : undefined;

        const dailyCounts = conversions.reduce(
          (acc: { [key: string]: number }, conv) => {
            const date = conv.createdAt.toDate().toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {}
        );

        setStats({
          totalConversions,
          totalPages,
          lastConversion,
          conversionHistory: Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date)),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <ProfilePage stats={stats} />;
}
