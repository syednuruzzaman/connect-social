"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

const ClientSidebar = () => {
  const { user, isLoaded } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isLoaded) {
    return <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>;
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Posts</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Followers</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Following</span>
            <span className="font-medium">0</span>
          </div>
        </div>
      </div>

      {/* Current Time */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Current Time</h3>
        <div className="text-center">
          <div className="text-lg font-mono">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-600">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Suggestions</h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <p>🌟 Complete your profile to get personalized suggestions</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>📱 Invite friends to join Connect Social</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>🎯 Create your first post to get started</p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
        <h3 className="font-semibold mb-2">Connect Social</h3>
        <p className="text-sm opacity-90">
          Share your thoughts, connect with friends, and discover amazing content.
        </p>
        <div className="mt-3 text-xs opacity-75">
          Version 1.0.0 • Built with Next.js
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
