import React from 'react';
import ClientUserSetup from "@/components/ClientUserSetup";
import ClientAddPost from "@/components/ClientAddPost";
import ClientFeed from "@/components/feed/ClientFeed";
import ClientNavigation from "@/components/ClientNavigation";
import ClientSidebar from "@/components/ClientSidebar";

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Social</h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </div>
        
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
              <ClientAddPost onPostCreated={() => window.location.reload()} />
              <ClientFeed />
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
