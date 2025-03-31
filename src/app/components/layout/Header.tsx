"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
          <span className="bg-blue-600 text-white rounded p-1 mr-2">P</span>
          Parseflow
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
                >
                  <User size={18} />
                  <span className="font-medium">{user.displayName || 'Account'}</span>
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Login / Register
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          {user ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-100 rounded">
                <User size={18} />
                <span className="font-medium">{user.displayName || 'Account'}</span>
              </div>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-left text-gray-700 hover:text-blue-600 py-2"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="py-2">
              <Link 
                href="/auth" 
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}