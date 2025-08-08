"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { Plus, Eye } from "lucide-react";

type StoryWithUser = Story & {
  user: User;
  video?: string | null;
  text?: string | null;
  mediaType?: string;
  privacy?: string;
  customViewers?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryWithUser | null>(null);
  const [img, setImg] = useState<any>();

  const { user, isLoaded } = useUser();

  const add = async () => {
    if (!img?.secure_url) return;

    console.log("Add story not available in mobile app");
    // No optimistic updates in mobile version

    try {
      const createdStory = await addStory(img.secure_url);
      if (createdStory) {
        setStoryList((prev) => [createdStory, ...prev]);
      }
      setImg(null)
    } catch (err) {}
  };

  const handleStoryCreated = (newStory: any) => {
    setStoryList((prev) => [newStory, ...prev.filter(s => s.userId !== newStory.userId)]);
  };

  // Mobile-compatible state (no optimistic updates)
  const [optimisticStories, setOptimisticStories] = useState(stories);

  const renderStoryContent = (story: StoryWithUser) => {
    if (story.mediaType === "text") {
      return (
        <div 
          className="w-24 h-32 rounded-xl flex items-center justify-center text-xs font-bold text-center p-3 relative overflow-hidden shadow-lg"
          style={{ 
            backgroundColor: story.backgroundColor || "#3B82F6",
            color: story.textColor || "#FFFFFF"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10 rounded-xl"></div>
          <span className="relative z-10 truncate leading-tight">{story.text || "Story"}</span>
        </div>
      );
    } else if (story.video) {
      return (
        <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-lg">
          <video 
            src={story.video} 
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end justify-center pb-2">
            <div className="w-6 h-6 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-1"></div>
            </div>
          </div>
          {/* Video duration indicator */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
            Video
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={story.img || story.user.avatar || "/noAvatar.png"}
            alt=""
            width={96}
            height={128}
            className="w-full h-full object-cover"
          />
          {/* Image indicator */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
            Photo
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Enhanced Add Story Button */}
      <div className="flex flex-col items-center gap-2 cursor-pointer relative group">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative w-24 h-32 rounded-xl border-3 border-dashed border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 flex flex-col items-center justify-center group-hover:scale-105 shadow-lg"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-2">
            <Plus className="w-6 h-6 text-white" />
          </div>
          
          <span className="text-xs font-medium text-gray-600 text-center px-2">
            Add Story
          </span>
          
          {/* User avatar in corner */}
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-md">
            <Image
              src={user?.imageUrl || "/noAvatar.png"}
              alt="Your avatar"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <span className="font-medium text-xs text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent max-w-[96px] truncate">
          Create Story
        </span>
      </div>

      {/* Enhanced Story Modal */}
      <StoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Story Viewer */}
      <StoryViewer 
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        currentUserId={userId}
      />

      {/* Existing Stories */}
      {optimisticStories.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer group relative"
          key={story.id}
          onClick={() => setSelectedStory(story)}
        >
          <div className="relative">
            {/* Story border indicator */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-0.5 group-hover:scale-105 transition-transform">
              <div className="bg-white rounded-xl p-0.5">
                {renderStoryContent(story)}
              </div>
            </div>
            
            {/* Privacy indicator */}
            {story.privacy !== "public" && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center z-10">
                <Eye className="w-3 h-3 text-white" />
              </div>
            )}

            {/* User avatar overlay */}
            <div className="absolute -bottom-1 left-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-md z-10">
              <Image
                src={story.user.avatar || "/noAvatar.png"}
                alt={story.user.username}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <span className="font-medium text-xs text-center max-w-[96px] truncate">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}
    </>
  );
};

export default StoryList;
