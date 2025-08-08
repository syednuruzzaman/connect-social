"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const AdminLink = () => {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!isMounted) return null;

  const isAdmin = user?.id === "user_30nQKqyDO8oYwyqyrAAf23AE1CR";

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className="cursor-pointer hover:scale-110 transition-transform">
      <Image src="/settings.png" alt="Admin" width={18} height={18} className="sm:w-5 sm:h-5" />
    </Link>
  );
};

export default AdminLink;
