import React from 'react';
import ClientUserSetup from "@/components/ClientUserSetup";
import ClientAddPost from "@/components/ClientAddPost";
import ClientFeed from "@/components/feed/ClientFeed";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Social</h1>
          <p className="text-gray-600">Share your thoughts with the world • Language: {locale}</p>
        </div>
        
        <div className="space-y-6">
          <ClientUserSetup />
          <ClientAddPost onPostCreated={() => window.location.reload()} />
          <ClientFeed />
        </div>
      </div>
    </div>
  );
}
