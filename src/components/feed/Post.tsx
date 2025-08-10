"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
// Define Post type manually if not available from Prisma
type PostType = {
  id: number;
  desc: string;
  img?: string | null;
  userId: string;
  createdAt: Date;
};

// Define User type if not available from Prisma
type User = {
  id: string;
  username: string;
  name?: string | null;
  surname?: string | null;
  avatar?: string | null;
};
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import Comments from "./Comments";

type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & {
  _count: { comments: number };
};

type PostProps = {
  post: FeedPostType;
  onDelete?: (postId: number) => Promise<void>;
  currentUserId?: string;
};

const Post = ({ post, onDelete, currentUserId }: PostProps) => {
  const { user, isLoaded } = useUser();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  // Detect if the media is a video based on URL extension
  const isVideo = post.img && (
    post.img.includes('.mp4') || 
    post.img.includes('.webm') || 
    post.img.includes('.ogg') ||
    post.img.includes('video') ||
    post.img.includes('.mov') ||
    post.img.includes('.avi')
  );

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(post.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current user can delete this post
  const canDelete = currentUserId && post.userId === currentUserId;

  // Prevent hydration mismatch by waiting for user to load
  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-4">
        {/* USER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={post.user.avatar || "/noAvatar.png"}
              width={40}
              height={40}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">
              {post.user.name && post.user.surname
                ? post.user.name + " " + post.user.surname
                : post.user.username}
            </span>
          </div>
          {/* Empty space for PostInfo to prevent layout shift */}
          <div className="w-6 h-6"></div>
        </div>
        {/* DESC */}
        <div className="flex flex-col gap-4">
          {post.img && (
            <div className="w-full min-h-96 relative">
              {isVideo ? (
                <div className="relative w-full min-h-96 bg-black rounded-md overflow-hidden">
                  <video 
                    src={post.img}
                    className="w-full h-full object-contain rounded-md"
                    controls={isVideoPlaying}
                    preload="metadata"
                    style={{ minHeight: '384px' }}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {!isVideoPlaying && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                      onClick={() => {
                        const video = document.querySelector(`video[src="${post.img}"]`) as HTMLVideoElement;
                        if (video) {
                          video.play();
                          setIsVideoPlaying(true);
                        }
                      }}
                    >
                      <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all">
                        <Play size={32} className="text-gray-800 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  {/* Video indicator */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                      Video
                    </span>
                  </div>
                </div>
              ) : (
                <Image
                  src={post.img}
                  fill
                  className="object-cover rounded-md"
                  alt=""
                />
              )}
            </div>
          )}
          <p>{post.desc}</p>
        </div>
        {/* INTERACTION */}
        <Suspense fallback="Loading...">
          <PostInteraction
            postId={Number(post.id)}
            likes={post.likes.map((like) => like.userId)}
            commentNumber={post._count.comments}
            postDesc={post.desc}
            postUserId={post.userId}
            onToggleComments={() => setShowComments(!showComments)}
            showComments={showComments}
          />
        </Suspense>
        
        {/* COMMENTS SECTION */}
        {showComments && (
          <div id={`comments-${post.id}`} className="mt-4">
            <Suspense fallback="Loading comments...">
              <Comments postId={Number(post.id)} />
            </Suspense>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            width={40}
            height={40}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + " " + post.user.surname
              : post.user.username}
          </span>
        </div>
        {user?.id === post.user.id && <PostInfo postId={post.id} onDelete={onDelete} />}
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            {isVideo ? (
              <div className="relative w-full min-h-96 bg-black rounded-md overflow-hidden">
                <video 
                  src={post.img}
                  className="w-full h-full object-contain rounded-md"
                  controls={isVideoPlaying}
                  preload="metadata"
                  style={{ minHeight: '384px' }}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
                
                {/* Custom Play Button Overlay */}
                {!isVideoPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                    onClick={() => {
                      const video = document.querySelector(`video[src="${post.img}"]`) as HTMLVideoElement;
                      if (video) {
                        video.play();
                        setIsVideoPlaying(true);
                      }
                    }}
                  >
                    <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all">
                      <Play size={32} className="text-gray-800 ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
                
                {/* Video indicator */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                    Video
                  </span>
                </div>
              </div>
            ) : (
              <Image
                src={post.img}
                fill
                className="object-cover rounded-md"
                alt=""
              />
            )}
          </div>
        )}
        <p>{post.desc}</p>
      </div>
      {/* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={Number(post.id)}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
          postDesc={post.desc}
          postUserId={post.userId}
          onToggleComments={() => setShowComments(!showComments)}
          showComments={showComments}
        />
      </Suspense>
      
      {/* COMMENTS SECTION */}
      {showComments && (
        <div id={`comments-${post.id}`} className="mt-4">
          <Suspense fallback="Loading comments...">
            <Comments postId={Number(post.id)} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default Post;
