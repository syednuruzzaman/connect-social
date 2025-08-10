'use client';

import Navbar from "@/components/Navbar";
import ClientUserSetup from "@/components/ClientUserSetup";
import ClientAddPost from "@/components/ClientAddPost";
import ClientFeed from "@/components/feed/ClientFeed";
import ClientNavigation from "@/components/ClientNavigation";
import ClientSidebar from "@/components/ClientSidebar";
import { useRef } from "react";

export default function HomePage() {
  const feedRef = useRef<{ refreshFeed: () => void }>(null);

  const handlePostCreated = () => {
    // Refresh the feed when a new post is created
    if (feedRef.current) {
      feedRef.current.refreshFeed();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ClientNavigation />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ClientUserSetup />
              <ClientAddPost onPostCreated={handlePostCreated} />
              <ClientFeed ref={feedRef} />
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ClientSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}