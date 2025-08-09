"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { X, Camera, Video, FileText, Calendar, BarChart3, Trash2, Plus, Share, Play } from "lucide-react";

const ClientAddPost = ({ onPostCreated }: { onPostCreated?: () => void }) => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!isLoaded) {
    return (
      <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>
    );
  }

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-700">Please sign in to create posts.</p>
      </div>
    );
  }

  const handleDeleteMedia = () => {
    setImg("");
    setIsVideoPlaying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!desc.trim() && !img) {
      return;
    }

    setPosting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          desc: desc.trim(),
          img: img || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset form
      setDesc("");
      setImg("");
      setIsVideoPlaying(false);
      
      // Notify parent component to refresh
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2 resize-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={posting}
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <button
              type="submit"
              disabled={posting || (!desc.trim() && !img)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              {posting ? "Posting..." : "Send"}
            </button>
          </div>
        </form>

        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result) => {
              if (typeof result.info === 'object' && result.info?.secure_url) {
                setImg(result.info.secure_url);
                setMediaType(result.info.resource_type === "video" ? "video" : "image");
              }
            }}
            onOpen={() => setUploading(true)}
            onClose={() => setUploading(false)}
          >
            {({ open }) => (
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                <Camera className="w-5 h-5" />
                <span className="text-xs">{uploading ? "Uploading..." : "Photo"}</span>
              </div>
            )}
          </CldUploadWidget>

          <div className="flex items-center gap-2 cursor-pointer">
            <Video className="w-5 h-5" />
            <span className="text-xs">Video</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Poll</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Event</span>
          </div>
        </div>

        {/* MEDIA PREVIEW */}
        {img && (
          <div className="w-full mt-4 relative">
            <div className="relative">
              {mediaType === "video" ? (
                <div className="relative">
                  <video
                    src={img}
                    className="w-full max-h-96 object-cover rounded-lg"
                    controls={isVideoPlaying}
                    poster={img}
                  />
                  {!isVideoPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  src={img}
                  alt="Preview"
                  width={500}
                  height={300}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              )}
              <button
                onClick={handleDeleteMedia}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAddPost;
