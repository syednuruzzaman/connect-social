"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import ClientSearchBox from "./ClientSearchBox";
import AdminLink from "./AdminLink";
import NotificationBadge from "./NotificationBadge";
import { ClientOnly } from "@/hooks/useClientMounted";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add a small visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 150);
    
    if (pathname === '/') {
      // If already on home page, use router refresh to reload data
      router.refresh();
    } else {
      // Navigate to home page
      router.push('/');
    }
  };

  return (
    <div className="h-24 flex items-center justify-between px-4 max-w-7xl mx-auto">
      {/* LEFT */}
      <div className="flex-shrink-0">
        <Link 
          href="/" 
          className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-all duration-150 active:scale-95"
          onClick={handleHomeClick}
        >
          Connect
        </Link>
      </div>
      {/* CENTER */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
        <div className="flex items-center w-full">
          {/* LINKS - Only show on large screens */}
          <div className="hidden lg:flex gap-4 xl:gap-6 text-gray-600 mr-4 xl:mr-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:text-blue-600 transition-all duration-150 active:scale-95"
              onClick={handleHomeClick}
            >
              <Image
                src="/home.png"
                alt="Homepage"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-sm">Homepage</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Image
                src="/friends.png"
                alt="Friends"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-sm">Friends</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Image
                src="/stories.png"
                alt="Stories"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span className="text-sm">Stories</span>
            </Link>
          </div>
          {/* SEARCH BAR - Responsive and always visible on md+ */}
          <ClientSearchBox />
        </div>
      </div>
      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
        <ClientOnly fallback={
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        }>
          <ClerkLoading>
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
          </ClerkLoading>
          <ClerkLoaded>
          <SignedIn>
            <Link href="/people" className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/people.png" alt="People" width={20} height={20} className="sm:w-6 sm:h-6" />
            </Link>
            <Link href="/messages" className="cursor-pointer hover:scale-110 transition-transform">
              <Image src="/messages.png" alt="Messages" width={18} height={18} className="sm:w-5 sm:h-5" />
            </Link>
            <Link href="/notifications" className="cursor-pointer hover:scale-110 transition-transform relative">
              <Image src="/notifications.png" alt="Notifications" width={18} height={18} className="sm:w-5 sm:h-5" />
              <NotificationBadge />
            </Link>
            <AdminLink />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" alt="" width={18} height={18} />
              <Link href="/sign-in" className="hover:text-blue-600 transition-colors">Login/Register</Link>
            </div>
          </SignedOut>
          </ClerkLoaded>
        </ClientOnly>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
