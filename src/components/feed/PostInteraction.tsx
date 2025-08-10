"use client";

import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useOptimistic, useState, useEffect } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import ShareModal from "@/components/ShareModal";

const PostInteraction = ({
  postId,
  likes,
  commentNumber,
  postDesc,
  postUserId,
  onToggleComments,
  showComments,
}: {
  postId: number;
  likes: string[];
  commentNumber: number;
  postDesc?: string;
  postUserId?: string;
  onToggleComments?: () => void;
  showComments?: boolean;
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

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  const likeAction = async () => {
    // Only allow action if user is authenticated and component is mounted
    if (!isMounted || !isLoaded || !userId) return;
    
    switchOptimisticLike("");
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

  const handleComment = () => {
    if (onToggleComments) {
      onToggleComments();
    } else {
      // Fallback: scroll to comment section or toggle comment form
      const commentSection = document.getElementById(`comments-${postId}`);
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log('Comment functionality - postId:', postId);
      }
    }
  };

  // Generate share URL and title
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${postId}`;
  const shareTitle = postDesc ? 
    `${postDesc.substring(0, 100)}${postDesc.length > 100 ? '...' : ''}` : 
    'Check out this post!';

  // Don't render interactive elements until hydrated to prevent mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center text-xs my-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 px-4 py-2 rounded-full transition-all duration-200 shadow-sm">
            <div className="p-1 bg-red-500 rounded-full">
              <Image
                src="/like.png"
                width={16}
                height={16}
                alt="Like"
                className="w-4 h-4"
              />
            </div>
            <span className="text-red-600 text-sm font-medium">
              {likes.length}
              <span className="hidden sm:inline"> Likes</span>
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 px-4 py-2 rounded-full transition-all duration-200 shadow-sm">
            <div className="p-1 bg-blue-500 rounded-full">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-blue-600 text-sm font-medium">
              {commentNumber}<span className="hidden sm:inline"> Comments</span>
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-50 hover:from-green-100 hover:to-green-100 px-4 py-2 rounded-full transition-all duration-200 shadow-sm">
            <div className="p-1 bg-green-500 rounded-full">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-green-600 text-sm font-medium">
              <span className="hidden sm:inline">Share</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center text-xs my-3">
        <div className="flex gap-3">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
            optimisticLike.isLiked 
              ? 'bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100'
          }`}>
            <form action={likeAction}>
              <button 
                className="flex items-center justify-center p-1 rounded-full transition-colors focus:outline-none"
                aria-label={optimisticLike.isLiked ? "Unlike post" : "Like post"}
                title={optimisticLike.isLiked ? "Unlike this post" : "Like this post"}
              >
                <div className={`p-1 rounded-full ${optimisticLike.isLiked ? 'bg-red-600' : 'bg-red-500'}`}>
                  <Image
                    src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                    width={16}
                    height={16}
                    alt="Like"
                    className="w-4 h-4"
                  />
                </div>
              </button>
            </form>
            <span className={`text-sm font-medium ${optimisticLike.isLiked ? 'text-red-700' : 'text-red-600'}`}>
              {optimisticLike.likeCount}
              <span className="hidden sm:inline"> Likes</span>
            </span>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer ${
            showComments 
              ? 'bg-gradient-to-r from-blue-100 to-blue-100 hover:from-blue-200 hover:to-blue-200' 
              : 'bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100'
          }`}>
            <button 
              onClick={handleComment}
              className="flex items-center justify-center p-1 rounded-full transition-colors focus:outline-none"
              aria-label={showComments ? "Hide comments" : "Show comments"}
              title={showComments ? "Hide comments" : "Show comments"}
            >
              <div className={`p-1 rounded-full ${showComments ? 'bg-blue-600' : 'bg-blue-500'}`}>
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </button>
            <span className={`text-sm font-medium ${showComments ? 'text-blue-700' : 'text-blue-600'}`}>
              {commentNumber}<span className="hidden sm:inline"> Comments</span>
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-50 hover:from-green-100 hover:to-green-100 px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer">
            <button 
              onClick={handleShare}
              className="flex items-center justify-center p-1 rounded-full transition-colors focus:outline-none"
              aria-label="Share post"
              title="Share this post"
            >
              <div className="p-1 bg-green-500 rounded-full">
                <Share2 className="w-4 h-4 text-white" />
              </div>
            </button>
            <span className="text-green-600 text-sm font-medium">
              <span className="hidden sm:inline">Share</span>
            </span>
          </div>
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
