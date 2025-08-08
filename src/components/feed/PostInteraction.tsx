"use client";

import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";
import ShareModal from "@/components/ShareModal";

const PostInteraction = ({
  postId,
  likes,
  commentNumber,
  postDesc,
  postUserId,
}: {
  postId: number;
  likes: string[];
  commentNumber: number;
  postDesc?: string;
  postUserId?: string;
}) => {
  const { isLoaded, userId } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: false, // Default to false during SSR
  });

  // Update like state after hydration
  useEffect(() => {
    if (isMounted && isLoaded && userId) {
      setLikeState(prev => ({
        ...prev,
        isLiked: likes.includes(userId)
      }));
    }
  }, [isMounted, isLoaded, userId, likes]);

  // Mobile-compatible state (no optimistic updates)
  const [optimisticLike, setOptimisticLike] = useState({
    likeCount: likes.length,
    isLiked: likes.includes(userId || "")
  });

  const likeAction = async () => {
    // Only allow action if user is authenticated and component is mounted
    if (!isMounted || !isLoaded || !userId) return;
    
    // No optimistic updates in mobile version
    console.log("Like action not available in mobile app");
    try {
      switchLike(postId);
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (err) {}
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Generate share URL and title
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${postId}`;
  const shareTitle = postDesc ? 
    `${postDesc.substring(0, 100)}${postDesc.length > 100 ? '...' : ''}` : 
    'Check out this post!';

  // Don't render interactive elements until hydrated to prevent mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center justify-between text-xs my-3">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
            <div className="flex items-center justify-center p-1 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]">
              <Image
                src="/like.png"
                width={20}
                height={20}
                alt="Like"
                className="w-4 h-4 sm:w-5 sm:h-5 opacity-50"
              />
            </div>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-500 text-xs font-medium">
              {likes.length}
              <span className="hidden sm:inline"> Likes</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
            <div className="flex items-center justify-center p-1 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]">
              <Image
                src="/comment.png"
                width={20}
                height={20}
                alt="Comment"
                className="w-4 h-4 sm:w-5 sm:h-5 opacity-50"
              />
            </div>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-500 text-xs font-medium">
              {commentNumber}<span className="hidden sm:inline"> Comments</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
          <div className="flex items-center justify-center p-1 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]">
            <Image
              src="/share.png"
              width={20}
              height={20}
              alt="Share"
              className="w-4 h-4 sm:w-5 sm:h-5 opacity-50"
            />
          </div>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-gray-500 text-xs font-medium">
            <span className="hidden sm:inline">Share</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between text-xs my-3">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
            <div>
              <button 
                className="flex items-center justify-center p-1 hover:bg-slate-200 rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={optimisticLike.isLiked ? "Unlike post" : "Like post"}
                title={optimisticLike.isLiked ? "Unlike this post" : "Like this post"}
                onClick={() => console.log("Like action not available in mobile app")}
              >
                <Image
                  src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                  width={20}
                  height={20}
                  alt="Like"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            </div>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-500 text-xs font-medium">
              {optimisticLike.likeCount}
              <span className="hidden sm:inline"> Likes</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
            <button 
              className="flex items-center justify-center p-1 hover:bg-slate-200 rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Comment on post"
              title="Comment on this post"
            >
              <Image
                src="/comment.png"
                width={20}
                height={20}
                alt="Comment"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-500 text-xs font-medium">
              {commentNumber}<span className="hidden sm:inline"> Comments</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center p-1 hover:bg-slate-200 rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="Share post"
            title="Share this post"
          >
            <Image
              src="/share.png"
              width={20}
              height={20}
              alt="Share"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-gray-500 text-xs font-medium">
            <span className="hidden sm:inline">Share</span>
          </span>
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareDescription={postDesc}
      />
    </>
  );
};

export default PostInteraction;
