import React from 'react';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Connect Social</h1>
          <p className="text-lg text-gray-600 mb-4">
            Your social media platform is live! 🎉
          </p>
          <p className="text-gray-600 mb-6">
            Current language: <span className="font-semibold text-blue-600">{locale}</span>
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-800 mb-2">✅ Successfully Deployed</h2>
              <p className="text-blue-700">Your app is running on Vercel with zero build errors!</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-semibold text-green-800 mb-3">🚀 Access Full Features</h2>
              <p className="text-green-700 mb-4">
                All social media features are ready including posts, feed, navigation, and user profiles.
              </p>
              <Link 
                href="/social" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Launch Social Features →
              </Link>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="font-semibold text-purple-800 mb-2">🌍 Multi-Language Support</h2>
              <p className="text-purple-700">
                Available in 7 languages: English, Bengali, French, Arabic, Urdu, Hindi, Chinese
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Connect Social v1.0 • Built with Next.js & Vercel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
