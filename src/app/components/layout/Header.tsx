// src/app/components/layout/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PDF to XML Converter
        </Link>
        
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-gray-700 hover:text-blue-600">
              Login / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}