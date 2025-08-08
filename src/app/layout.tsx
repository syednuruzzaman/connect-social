import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from 'react';

// Force dynamic rendering for Clerk authentication
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Connect - Your Social Network",
  description: "Connect with friends, share moments, and discover new connections on our modern social media platform",
};

type Props = {
  children: ReactNode;
};

// This layout is required for the app directory.
export default function RootLayout({ children }: Props) {
  return (
    <ClerkProvider>
      <html>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
