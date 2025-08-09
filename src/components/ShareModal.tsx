"use client";

import { useState, useEffect } from "react";
import { X, Link, Facebook, Twitter, MessageCircle, Mail, Copy, Check, Users, Globe, UserPlus, Send } from "lucide-react";
import Image from "next/image";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareTitle: string;
  shareDescription?: string;
}

interface Friend {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
}

interface User {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
}

const ShareModal = ({ isOpen, onClose, shareUrl, shareTitle, shareDescription }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"external" | "friends" | "everyone">("external");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch friends when friends tab is selected
  useEffect(() => {
    if (isOpen && activeTab === "friends" && friends.length === 0) {
      fetchFriends();
    }
  }, [isOpen, activeTab, friends.length]);

  // Fetch all users when everyone tab is selected
  useEffect(() => {
    if (isOpen && activeTab === "everyone" && allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [isOpen, activeTab, allUsers.length]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("external");
      setSelectedFriends([]);
      setSelectedUsers([]);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShareWithFriends = async () => {
    if (selectedFriends.length === 0) return;
    
    try {
      const response = await fetch('/api/share-with-friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendIds: selectedFriends,
          shareUrl,
          shareTitle,
          shareDescription,
        }),
      });
      
      if (response.ok) {
        alert(`Shared with ${selectedFriends.length} friend${selectedFriends.length > 1 ? 's' : ''}!`);
        setSelectedFriends([]);
        onClose();
      }
    } catch (error) {
      console.error('Error sharing with friends:', error);
    }
  };

  const handleShareWithUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const response = await fetch('/api/share-with-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          shareUrl,
          shareTitle,
          shareDescription,
        }),
      });
      
      if (response.ok) {
        alert(`Shared with ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}!`);
        setSelectedUsers([]);
        onClose();
      }
    } catch (error) {
      console.error('Error sharing with users:', error);
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: "text-gray-600 hover:text-gray-800",
      bgColor: "hover:bg-gray-100",
      action: copyToClipboard,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600 hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-500 hover:text-sky-700",
      bgColor: "hover:bg-sky-50",
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-600 hover:text-green-800",
      bgColor: "hover:bg-green-50",
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
        window.open(whatsappUrl, '_blank');
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-red-600 hover:text-red-800",
      bgColor: "hover:bg-red-50",
    },
    {
      name: "Gmail",
      icon: Mail,
      color: "text-red-600 hover:text-red-800",
      bgColor: "hover:bg-red-50",
      action: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription || shareTitle}\n\n${shareUrl}`)}`;
        window.open(gmailUrl, '_blank');
      },
    },
    {
      name: "Outlook",
      icon: Mail,
      color: "text-blue-600 hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
      action: () => {
        const outlookUrl = `https://outlook.live.com/mail/deeplink/compose?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription || shareTitle}\n\n${shareUrl}`)}`;
        window.open(outlookUrl, '_blank');
      },
    },
    {
      name: "Default Email",
      icon: Mail,
      color: "text-gray-600 hover:text-gray-800",
      bgColor: "hover:bg-gray-50",
      action: () => {
        const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription || shareTitle}\n\n${shareUrl}`)}`;
        window.open(emailUrl);
      },
    },
  ];

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const renderUserCard = (user: Friend | User, isSelected: boolean, onToggle: () => void) => (
    <div
      key={user.id}
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
        isSelected
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
      }`}
    >
      <Image
        src={user.avatar || "/noAvatar.png"}
        width={40}
        height={40}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {user.name && user.surname
            ? `${user.name} ${user.surname}`
            : user.username}
        </p>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 ${
        isSelected
          ? 'bg-blue-500 border-blue-500'
          : 'border-gray-300'
      }`}>
        {isSelected && (
          <Check size={12} className="text-white m-0.5" />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-lg font-bold">Share Post</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("external")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
              activeTab === "external"
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Globe size={18} />
            External
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
              activeTab === "friends"
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Users size={18} />
            Friends
          </button>
          <button
            onClick={() => setActiveTab("everyone")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium transition-colors ${
              activeTab === "everyone"
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <UserPlus size={18} />
            Everyone
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "external" && (
            <div className="space-y-4">
              {/* Share URL Display */}
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-sm text-gray-600 mb-1">Sharing:</p>
                <p className="text-sm font-medium text-gray-800 truncate">{shareTitle}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{shareUrl}</p>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">Choose how to share:</p>
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${option.bgColor} border border-gray-200`}
                  >
                    <option.icon className={`${option.color} transition-colors`} size={20} />
                    <span className="font-medium text-gray-700">{option.name}</span>
                    {option.name === "Copy Link" && copied && (
                      <span className="ml-auto text-green-600 text-sm font-medium">Copied!</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Native Share API (if available) */}
              {'share' in navigator && (
                <button
                  onClick={() => {
                    navigator.share({
                      title: shareTitle,
                      text: shareDescription,
                      url: shareUrl,
                    }).catch(console.error);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium"
                >
                  <Link size={18} />
                  More sharing options
                </button>
              )}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Share with friends:</p>
                {selectedFriends.length > 0 && (
                  <button
                    onClick={handleShareWithFriends}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <Send size={14} />
                    Share ({selectedFriends.length})
                  </button>
                )}
              </div>

              {loadingFriends ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading friends...</div>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No friends to share with yet.</p>
                  <p className="text-sm text-gray-400">Connect with people to share content!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {friends.map((friend) => 
                    renderUserCard(
                      friend,
                      selectedFriends.includes(friend.id),
                      () => toggleFriendSelection(friend.id)
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "everyone" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Connect & share with everyone:</p>
                {selectedUsers.length > 0 && (
                  <button
                    onClick={handleShareWithUsers}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Send size={14} />
                    Share ({selectedUsers.length})
                  </button>
                )}
              </div>

              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading users...</div>
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No users found.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allUsers.map((user) => 
                    renderUserCard(
                      user,
                      selectedUsers.includes(user.id),
                      () => toggleUserSelection(user.id)
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
