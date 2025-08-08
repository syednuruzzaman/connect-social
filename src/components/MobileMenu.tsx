"use client";

import Link from "next/link";
import Image from "next/image";
import MobileSearchBox from "./MobileSearchBox";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname for conditional rendering
  const locale = pathname.split('/')[1] || 'en';
  
  // Simple translations mapping for demonstration
  const translations = {
    en: {
      home: 'Home',
      messages: 'Messages', 
      groups: 'Groups',
      friends: 'Friends',
      stories: 'Stories',
      login: 'Login'
    },
    bn: {
      home: 'হোম',
      messages: 'বার্তা',
      groups: 'গ্রুপ', 
      friends: 'বন্ধুরা',
      stories: 'গল্প',
      login: 'লগইন'
    },
    fr: {
      home: 'Accueil',
      messages: 'Messages',
      groups: 'Groupes',
      friends: 'Amis', 
      stories: 'Histoires',
      login: 'Connexion'
    }
  };
  
  const t = translations[locale as keyof typeof translations] || translations.en;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="w-6 h-6" />; // Placeholder with same dimensions
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (pathname === '/') {
      router.refresh();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="md:hidden">
      <div
        className="flex flex-col gap-[4.5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "opacity-0" : ""
          } ease-in-out duration-500`}
        />
        <div
          className={`w-6 h-1 bg-blue-500 rounded-sm ${
            isOpen ? "-rotate-45" : ""
          } origin-left ease-in-out duration-500`}
        />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10 shadow-lg">
          <div className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Connect
          </div>
          {/* Mobile Search */}
          <MobileSearchBox />
          <Link href="/" onClick={handleHomeClick}>{t.home}</Link>
          <Link href="/messages" onClick={() => setIsOpen(false)}>{t.messages}</Link>
          <Link href="/groups" onClick={() => setIsOpen(false)}>{t.groups}</Link>
          <Link href="/" onClick={() => setIsOpen(false)}>{t.friends}</Link>
          <Link href="/" onClick={() => setIsOpen(false)}>{t.stories}</Link>
          <Link href="/sign-in" onClick={() => setIsOpen(false)}>{t.login}</Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
