import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect - Your Social Network",
  description: "Connect with friends, share moments, and discover new connections on our modern social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} h-full overflow-y-auto`}>
          <div className="min-h-screen flex flex-col">
            <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 sticky top-0 z-50 shadow-sm">
              <Navbar />
            </div>
            <div className="bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
