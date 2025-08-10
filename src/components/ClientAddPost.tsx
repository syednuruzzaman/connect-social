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
    setMediaType("image");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submit clicked - desc:", desc, "img:", img);
    
    if (!desc.trim() && !img) {
      console.log("No content to post");
      alert("Please add some content or media before posting.");
      return;
    }

    setPosting(true);
    try {
      console.log("Sending post request...");
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

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post created successfully:", result);

      // Reset form
      setDesc("");
      setImg("");
      setIsVideoPlaying(false);
      setMediaType("image");
      
      // Show success message
      alert("Post created successfully!");
      
      // Notify parent component to refresh
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
              onClick={(e) => {
                console.log("Button clicked!", { posting, desc: desc.trim(), img });
                console.log("Button disabled?", posting || (!desc.trim() && !img));
              }}
            >
              {posting ? "Posting..." : "Send"}
            </button>
          </div>
        </form>

        {/* POST OPTIONS */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            options={{
              multiple: false,
              resourceType: "image",
              clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
              maxFileSize: 209715200, // 200MB like YouTube
              maxImageWidth: 7680, // 8K resolution
              maxImageHeight: 4320,
            }}
            onSuccess={(result) => {
              console.log("Image upload result:", result);
              if (typeof result.info === 'object' && result.info?.secure_url) {
                setImg(result.info.secure_url);
                setMediaType("image");
              }
            }}
            onError={(error) => {
              console.error("Image upload error:", error);
              alert("Failed to upload image. Please try again.");
            }}
            onOpen={() => setUploading(true)}
            onClose={() => setUploading(false)}
          >
            {({ open }) => (
              <div 
                className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md" 
                onClick={() => open()}
              >
                <div className="p-1 bg-blue-500 rounded-full">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700">
                  {uploading ? "Uploading..." : "Photo"}
                </span>
              </div>
            )}
          </CldUploadWidget>

          <CldUploadWidget
            uploadPreset="social"
            options={{
              multiple: false,
              resourceType: "video",
              clientAllowedFormats: ["mp4", "webm", "mov", "avi", "mkv", "flv"],
              maxFileSize: 2147483648, // 2GB like YouTube standard upload
              maxVideoFileSize: 2147483648,
              sources: ["local", "url", "camera"],
            }}
            onSuccess={(result) => {
              console.log("Video upload result:", result);
              if (typeof result.info === 'object' && result.info?.secure_url) {
                console.log("Video URL:", result.info.secure_url);
                console.log("Resource type:", result.info.resource_type);
                setImg(result.info.secure_url);
                setMediaType("video");
                setIsVideoPlaying(false);
              }
            }}
            onError={(error) => {
              console.error("Video upload error:", error);
              alert("Failed to upload video. Please try again.");
            }}
            onOpen={() => setUploading(true)}
            onClose={() => setUploading(false)}
          >
            {({ open }) => (
              <div 
                className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md" 
                onClick={() => open()}
              >
                <div className="p-1 bg-red-500 rounded-full">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-red-700">
                  {uploading ? "Uploading..." : "Video"}
                </span>
              </div>
            )}
          </CldUploadWidget>

          <div className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="p-1 bg-green-500 rounded-full">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-green-700">Poll</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="p-1 bg-purple-500 rounded-full">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-700">Event</span>
          </div>
        </div>

        {/* MEDIA PREVIEW */}
        {img && (
          <div className="w-full mt-4 relative">
            <p className="text-sm text-gray-600 mb-2">
              Preview: {mediaType} - {img.substring(img.lastIndexOf('/') + 1)}
            </p>
            <div className="relative">
              {mediaType === "video" ? (
                <div className="relative bg-gray-900 rounded-lg overflow-hidden min-h-[200px]">
                  <video
                    key={img} // Force re-render when URL changes
                    className="w-full max-h-96 rounded-lg"
                    controls={isVideoPlaying}
                    preload="metadata"
                    muted
                    autoPlay={false}
                    onLoadStart={() => console.log("Video load start")}
                    onLoadedData={() => console.log("Video loaded successfully")}
                    onError={(e) => console.error("Video loading error:", e)}
                    onCanPlay={() => console.log("Video can play")}
                  >
                    <source src={img} type="video/mp4" />
                    <source src={img} type="video/webm" />
                    <source src={img} type="video/mov" />
                    Your browser does not support the video tag.
                  </video>
                  {!isVideoPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-40"
                      onClick={() => {
                        console.log("Play button clicked, video URL:", img);
                        setIsVideoPlaying(true);
                      }}
                    >
                      <div className="bg-white rounded-full p-4 hover:bg-gray-100 transition-colors">
                        <Play className="w-8 h-8 text-black fill-black ml-1" />
                      </div>
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
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-20"
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
