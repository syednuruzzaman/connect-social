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

type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & {
  _count: { comments: number };
};

const Post = ({ post }: { post: FeedPostType }) => {
  const { user, isLoaded } = useUser();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Detect if the media is a video based on URL extension
  const isVideo = post.img && (
    post.img.includes('.mp4') || 
    post.img.includes('.webm') || 
    post.img.includes('.ogg') ||
    post.img.includes('video') ||
    post.img.includes('.mov') ||
    post.img.includes('.avi')
  );

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
          />
        </Suspense>
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
        {user?.id === post.user.id && <PostInfo postId={post.id} />}
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
        />
      </Suspense>
    </div>
  );
};

export default Post;
