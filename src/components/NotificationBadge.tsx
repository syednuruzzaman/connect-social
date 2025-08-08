"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const NotificationBadge = () => {
  const { user, isLoaded } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isLoaded || !user?.id) return;
      
      try {
        const response = await fetch('/api/notifications/count');
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    
    // Optionally, poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id, isLoaded]);

  if (!isLoaded || !user || unreadCount === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </div>
  );
};

export default NotificationBadge;
