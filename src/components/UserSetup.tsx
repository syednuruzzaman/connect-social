"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientOnly } from "@/hooks/useClientMounted";

export default function UserSetup() {
  return (
    <ClientOnly fallback={<div className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>}>
      <UserSetupContent />
    </ClientOnly>
  );
}

function UserSetupContent() {
  const { user } = useUser();
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Check if user exists in database
  useEffect(() => {
    const checkUserExists = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/check-user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserExists(data.exists);
          if (data.exists && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setCheckingUser(false);
      }
    };

    checkUserExists();
  }, [user]);

  const createUserInDB = async () => {
    if (!user) return;
    
    setLoading(true);
    setStatus("Creating user profile...");
    
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("✅ User profile created successfully! Redirecting to your profile...");
        setUserExists(true);
        // Redirect to settings page after successful creation
        setTimeout(() => {
          router.push('/settings');
        }, 1500);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus("❌ Failed to create user profile");
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = () => {
    router.push('/settings');
  };

  if (!user || checkingUser) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        {userExists ? "User Profile" : "User Setup"}
      </h3>
      
      {userExists && currentUser && (
        <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
          <div className="flex items-center gap-3">
            <Image
              src={currentUser.avatar || "/noAvatar.png"}
              alt="Profile"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-800">
                {currentUser.name && currentUser.surname 
                  ? `${currentUser.name} ${currentUser.surname}`
                  : "No name set"
                }
              </div>
              <div className="text-sm text-gray-600">@{currentUser.username || "No username"}</div>
              {currentUser.description && (
                <div className="text-xs text-gray-500 mt-1">{currentUser.description}</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <p className="text-sm text-blue-600 mb-3">
        Hi {user.firstName}! {userExists 
          ? "Your profile is set up. You can edit your information, upload photos, and manage settings." 
          : "Click the button below to create your profile in the database. This will allow you to create posts and interact with other users."
        }
      </p>
      <div className="flex gap-3 flex-wrap">
        {!userExists && (
          <button
            onClick={createUserInDB}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create User Profile"}
          </button>
        )}
        <button
          onClick={goToProfile}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {userExists ? "Edit Profile & Settings" : "Go to Settings"}
        </button>
        {userExists && (
          <button
            onClick={() => router.push(`/profile/${currentUser?.username || user.username}`)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            View Public Profile
          </button>
        )}
      </div>
      {status && (
        <p className="mt-2 text-sm font-medium">{status}</p>
      )}
    </div>
  );
}
