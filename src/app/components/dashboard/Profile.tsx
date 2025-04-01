"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/Header";
import { User, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfileProps {
  stats?: {
    totalConversions?: number;
    totalPages?: number;
    lastConversion?: Date;
    conversionHistory?: Array<{ date: string; count: number }>;
  };
}

export default function ProfilePage({ stats }: ProfileProps) {
  const { user, loading, updateProfile, updatePassword } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
    
    // Populate form with user data when available
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user, loading, router]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile({
        displayName,
        photoURL
      });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully!");
      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Success and error notifications
  const renderNotification = () => {
    if (success) {
      return (
        <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>{success}</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
          
          {renderNotification()}
          
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Conversion Statistics</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Total Conversions</dt>
                  <dd className="text-2xl font-bold">
                    {stats?.totalConversions || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Pages Processed</dt>
                  <dd className="text-2xl font-bold">
                    {stats?.totalPages || 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Conversion</dt>
                  <dd className="text-gray-600">
                    {stats?.lastConversion ? 
                      new Date(stats.lastConversion).toLocaleDateString() : 
                      'Never'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Conversion History</h3>
              {stats?.conversionHistory && stats.conversionHistory.length > 0 ? (
                <Line
                  data={{
                    labels: stats.conversionHistory.map(d => d.date),
                    datasets: [{
                      label: 'Conversions per Day',
                      data: stats.conversionHistory.map(d => d.count),
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      tension: 0.1
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No conversion history available
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Picture Section */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
                        {photoURL ? (
                          <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User size={48} className="text-gray-400" />
                        )}
                      </div>
                      <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                        <Camera size={16} />
                        <input id="photo-upload" type="file" className="hidden" />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Or enter image URL below
                    </p>
                  </div>
                  
                  {/* Profile Details Section */}
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        type="url"
                        id="photoURL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/profile.jpg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin mr-2" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>   
    </div>
  );
}