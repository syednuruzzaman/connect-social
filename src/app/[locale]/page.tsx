import React from 'react';
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden lg:block w-[25%] xl:w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[50%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Connect Social</h1>
            <p className="text-gray-600 mb-2">Current locale: <span className="font-semibold">{locale}</span></p>
            <p className="text-gray-600">🚀 Your social media app is now live! We're working on adding more features.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Coming Soon:</h3>
              <ul className="text-blue-700 mt-2 space-y-1">
                <li>• Create and share posts</li>
                <li>• Social feed with real-time updates</li>
                <li>• User interactions (likes, comments)</li>
                <li>• Messaging system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-[25%] xl:w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
}
