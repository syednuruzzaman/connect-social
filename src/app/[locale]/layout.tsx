import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "../globals.css";

// Force dynamic rendering to match root layout for Clerk authentication
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });
const locales = ['en', 'bn', 'fr', 'ar', 'ur', 'hi', 'zh'];

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    return <div>Invalid locale</div>;
  }

  // Determine if this is an RTL language
  const isRTL = ['ar', 'ur'].includes(locale);

  return (
    <div className={`${inter.className} h-full overflow-y-auto`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="min-h-screen flex flex-col">
        <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 sticky top-0 z-50 shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
