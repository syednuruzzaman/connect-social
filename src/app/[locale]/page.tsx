import React, { Suspense } from 'react';
import AddPost from "@/components/AddPost";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import UserSetup from "@/components/UserSetup";

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
          <UserSetup />
          <AddPost />
          <Suspense fallback={<div className="animate-pulse bg-gray-100 h-32 rounded-lg">Loading feed...</div>}>
            <Feed />
          </Suspense>
        </div>
      </div>
      <div className="hidden lg:block w-[25%] xl:w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
}
