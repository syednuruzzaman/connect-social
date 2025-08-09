import React from 'react';
import AddPost from "@/components/AddPost";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import UserSetup from "@/components/UserSetup";

// Generate static params for all supported locales
export async function generateStaticParams() {
  const locales = ['en', 'bn', 'fr', 'ar', 'ur', 'hi', 'zh'];
  return locales.map((locale) => ({
    locale: locale,
  }));
}

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
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[25%] xl:w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
}
