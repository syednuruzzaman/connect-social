"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, Eye, Send, MoreHorizontal } from "lucide-react";

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  story: any;
  currentUserId: string;
}

const StoryViewer = ({ isOpen, onClose, story, currentUserId }: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onClose();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !story) return null;

  const renderStoryContent = () => {
    if (story.mediaType === "text") {
      return (
        <div 
          className="w-full h-full flex items-center justify-center p-8 text-center relative overflow-hidden"
          style={{ 
            backgroundColor: story.backgroundColor || "#3B82F6",
            color: story.textColor || "#FFFFFF"
          }}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-20 w-12 h-12 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-bold leading-relaxed">
              {story.text}
            </p>
          </div>
        </div>
      );
    } else if (story.video) {
      return (
        <div className="w-full h-full relative">
          <video 
            src={story.video} 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
          />
          {story.text && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
              <p className="text-white text-sm">{story.text}</p>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full h-full relative">
          <Image
            src={story.img || "/noAvatar.png"}
            alt="Story"
            fill
            className="object-cover"
          />
          {story.text && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3">
              <p className="text-white text-sm">{story.text}</p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Container */}
      <div className="relative w-full max-w-md h-full max-h-[90vh] bg-black rounded-lg overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 z-30">
          <div className="w-full bg-gray-600 bg-opacity-50 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Image
              src={story.user?.avatar || "/noAvatar.png"}
              alt={story.user?.username || "User"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <div>
              <p className="font-semibold text-sm">
                {story.user?.name || story.user?.username}
              </p>
              <p className="text-xs opacity-80">
                {new Date(story.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {story.privacy !== "public" && (
              <div className="flex items-center gap-1 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                <Eye size={12} />
                <span className="capitalize">{story.privacy}</span>
              </div>
            )}
            <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="w-full h-full">
          {renderStoryContent()}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center gap-4 text-white">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? "bg-red-500" : "bg-white bg-opacity-20 hover:bg-opacity-30"
            }`}
          >
            <Heart size={20} fill={isLiked ? "white" : "none"} />
          </button>
          
          <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full">
            <Send size={20} />
          </button>
          
          <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full">
            <MoreHorizontal size={20} />
          </button>
          
          <div className="ml-auto flex items-center gap-1 text-sm opacity-80">
            <Eye size={16} />
            <span>0</span>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      ></div>
    </div>
  );
};

export default StoryViewer;
