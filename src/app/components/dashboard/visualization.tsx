import React, { useEffect, useState } from "react";

const ConversionVisualization = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-sm mt-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
        How Conversion Works
      </h3>

      <div className="flex items-center justify-center">
        <div
          className={`transform transition-all duration-500 ${
            animationStep >= 1 ? "scale-90 opacity-80" : ""
          }`}
        >
          <div className="w-16 h-20 bg-red-100 dark:bg-red-900/30 rounded-md flex flex-col items-center justify-center border border-red-200 dark:border-red-800 relative">
            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-400 dark:bg-red-500"></div>
            <div className="text-xs font-bold text-red-500 dark:text-red-400">
              PDF
            </div>
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded my-1"></div>
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div
          className={`mx-2 transition-all duration-500 ${
            animationStep >= 1
              ? "text-blue-500 dark:text-blue-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </div>

        <div
          className={`transform transition-all duration-500 ${
            animationStep < 1
              ? "scale-75 opacity-50"
              : animationStep === 1
              ? "scale-110"
              : "scale-90 opacity-80"
          }`}
        >
          <div className="w-16 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-md flex flex-col items-center justify-center border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 relative">
              <div
                className={`w-10 h-10 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full ${
                  animationStep === 1 ? "animate-spin" : ""
                }`}
              ></div>
              {animationStep > 1 && (
                <svg
                  className="w-6 h-6 text-blue-500 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
            <div className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-1">
              Process
            </div>
          </div>
        </div>

        <div
          className={`mx-2 transition-all duration-500 ${
            animationStep >= 2
              ? "text-blue-500 dark:text-blue-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </div>

        <div
          className={`transform transition-all duration-500 ${
            animationStep < 2
              ? "scale-75 opacity-50"
              : animationStep === 2
              ? "scale-110"
              : "scale-100"
          }`}
        >
          <div className="w-16 h-20 bg-green-100 dark:bg-green-900/30 rounded-md flex flex-col items-center justify-center border border-green-200 dark:border-green-800 relative">
            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-400 dark:bg-green-500"></div>
            <div className="text-xs font-bold text-green-500 dark:text-green-400">
              XML
            </div>
            <div className="w-10 h-4 flex flex-col items-start justify-center">
              <div className="w-8 h-px bg-gray-400 dark:bg-gray-500"></div>
              <div className="w-6 h-px bg-gray-400 dark:bg-gray-500 ml-2 my-1"></div>
              <div className="w-8 h-px bg-gray-400 dark:bg-gray-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {animationStep === 0 && "Select your PDF document to begin"}
        {animationStep === 1 &&
          "Processing with AI-powered structure detection"}
        {animationStep === 2 && "Converting to structured XML format"}
        {animationStep === 3 && "Preserving document hierarchy and content"}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="p-2 bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-50 rounded text-center">
          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg">
            100%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Accuracy
          </div>
        </div>
        <div className="p-2 bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-50 rounded text-center">
          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg">
            &lt;5s
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Processing
          </div>
        </div>
        <div className="p-2 bg-white dark:bg-gray-700 bg-opacity-70 dark:bg-opacity-50 rounded text-center">
          <div className="text-blue-500 dark:text-blue-400 font-bold text-lg">
            All
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            PDF Types
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionVisualization;
