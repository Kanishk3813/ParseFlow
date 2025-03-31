"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
              P
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin 
              ? "Sign in to access your Parseflow dashboard" 
              : "Join Parseflow to start managing your data"
            }
          </p>
        </div>
        
        {error && (
          <div className="flex items-center p-4 text-sm bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder={isLogin ? "Your password" : "Create password"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading
                ? (isLogin ? "Signing in..." : "Creating account...")
                : (isLogin ? "Sign in" : "Create account")}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {isLogin ? "New to Parseflow?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLogin ? "Create a new account" : "Sign in to existing account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}