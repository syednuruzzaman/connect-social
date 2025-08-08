"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  name: string | null;
  surname: string | null;
}

interface UserSelectorProps {
  currentUserId: string;
}

const UserSelector = ({ currentUserId }: UserSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/users/all');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const filteredUsers = users.filter((user) => {
    if (user.id === currentUserId) return false;
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    const name = user.name?.toLowerCase() || "";
    const surname = user.surname?.toLowerCase() || "";
    
    return username.includes(searchLower) || 
           name.includes(searchLower) || 
           surname.includes(searchLower);
  });

  const handleUserSelect = (username: string) => {
    setIsOpen(false);
    setSearchTerm("");
    router.push(`/messages/${username}`);
  };

  const handleSelectAll = () => {
    setIsOpen(false);
    setSearchTerm("");
    router.push('/messages/all'); // We'll create this route
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Image src="/messages.png" alt="" width={16} height={16} className="invert" />
        <span>New Message</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {/* Select All Option */}
            <button
              onClick={handleSelectAll}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-2-4h4m-4 0l-3-3m3 3l-3 3M9 1H4a2 2 0 00-2 2v6a2 2 0 002 2h5m6 0a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 1v6m0 0V1" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-blue-600">Message All Users</div>
                <div className="text-sm text-blue-500">Broadcast to everyone</div>
              </div>
            </button>

            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.username)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src={user.avatar || "/noAvatar.png"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800">
                      {user.name && user.surname 
                        ? `${user.name} ${user.surname}`
                        : user.username
                      }
                    </div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserSelector;
