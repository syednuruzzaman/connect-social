import React from 'react';
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import ClientUserSetup from "@/components/ClientUserSetup";
import ClientAddPost from "@/components/ClientAddPost";
import ClientFeed from "@/components/feed/ClientFeed";

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
          <ClientUserSetup />
          <ClientAddPost onPostCreated={() => window.location.reload()} />
          <ClientFeed />
        </div>
      </div>
      <div className="hidden lg:block w-[25%] xl:w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
}
