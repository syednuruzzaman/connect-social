import React from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  
  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Welcome to Connect Social</h1>
        <p>Current locale: {locale}</p>
        <p>This is a simplified version to test the build.</p>
      </div>
    </div>
  );
}
