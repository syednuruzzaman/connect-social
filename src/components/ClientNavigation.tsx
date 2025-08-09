"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Home, Users, MessageCircle, Bell, User, Settings, LogOut } from "lucide-react";

const ClientNavigation = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="animate-pulse bg-gray-100 h-12 rounded-lg"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
      <nav className="space-y-2">
        <Link href="/en" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        
        <Link href="/people" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <Users className="w-5 h-5" />
          <span>People</span>
        </Link>
        
        <Link href="/messages" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <MessageCircle className="w-5 h-5" />
          <span>Messages</span>
        </Link>
        
        <Link href="/notifications" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </Link>
        
        {user && (
          <>
            <Link href={`/profile/${user.username || user.id}`} className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            
            <Link href="/settings" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </>
        )}
      </nav>
      
      {user && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2">
            <Image
              src={user.imageUrl || "/noAvatar.png"}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{user.username || 'user'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientNavigation;
