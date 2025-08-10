'use client';

import Navbar from "@/components/Navbar";
import ClientUserSetup from "@/components/ClientUserSetup";
import ClientAddPost from "@/components/ClientAddPost";
import ClientFeed from "@/components/feed/ClientFeed";
import ClientSidebar from "@/components/ClientSidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <ClientUserSetup />
              <ClientAddPost />
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