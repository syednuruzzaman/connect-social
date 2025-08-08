"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileHeaderProps {
  userDisplayName: string;
}

export default function ProfileHeader({ userDisplayName }: ProfileHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Large, prominent back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Go Back"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
          
          <div className="ml-2">
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
              {userDisplayName}
            </h1>
            <p className="text-sm text-gray-500">Profile</p>
          </div>
        </div>
        
        {/* Close button for mobile - additional exit option */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
            title="Close Profile"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-600" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => router.push('/')}
            className="w-full text-left py-3 px-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            🏠 Go to Homepage
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            ← Go Back
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            ⚙️ Settings
          </button>
        </div>
      )}
    </div>
  );
}
