"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "@/lib/actions";
import { CldUploadWidget } from "next-cloudinary";
import { X, Camera, Video, FileText, Calendar, BarChart3, Trash2, Plus, Share, Play } from "lucide-react";
import ShareModal from "./ShareModal";

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isLoaded) {
    return "Loading...";
  }

  const handleDeleteMedia = () => {
    setImg("");
    setIsVideoPlaying(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Generate share content for the app itself
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareTitle = "Join our amazing social platform!";
  const shareDescription = "Connect with friends, share moments, and discover new content on our social media platform.";

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={user?.imageUrl || "/noAvatar.png"}
          alt=""
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">Create a Post</h3>
          <p className="text-sm text-gray-500">Share what's on your mind with your friends</p>
        </div>
      </div>

      {/* POST FORM */}
      <form action={(formData) => addPost(formData, img)} className="space-y-4">
        {/* TEXT INPUT */}
        <textarea
          placeholder="What's on your mind?"
          className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none min-h-[100px] transition-all"
          name="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
        />
        
        {/* MEDIA PREVIEW */}
        {img && (
          <div className="relative group">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2">
              {mediaType === "video" ? (
                <div className="relative">
                  <video 
                    ref={(video) => {
                      if (video) {
                        video.addEventListener('loadeddata', () => {
                          // Video loaded successfully
                        });
                      }
                    }}
                    src={img} 
                    className="w-full max-h-64 rounded-lg bg-black" 
                    controls={isVideoPlaying}
                    preload="metadata"
                    poster="" // We'll generate a poster frame
                    style={{ objectFit: 'contain' }}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />
                  
                  {/* Custom Play Button Overlay */}
                  {!isVideoPlaying && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer"
                      onClick={() => {
                        const video = document.querySelector('video') as HTMLVideoElement;
                        if (video) {
                          video.play();
                          setIsVideoPlaying(true);
                        }
                      }}
                    >
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all">
                        <Play size={24} className="text-gray-800 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  {/* Video placeholder when not loaded */}
                  <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center" style={{ zIndex: -1 }}>
                    <div className="text-white text-center">
                      <Video size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Loading video...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={img}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              )}
              
              {/* Delete and Replace buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleDeleteMedia}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
              
              {/* Media type indicator */}
              <div className="absolute top-4 left-4">
                <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                  {mediaType === "video" ? "Video" : "Photo"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MEDIA UPLOAD OPTIONS */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Photo Upload */}
            <CldUploadWidget
              uploadPreset="social"
              options={{
                resourceType: "image",
                maxFileSize: 10000000, // 10MB
              }}
              onSuccess={(result) => {
                if (typeof result.info === 'object' && result.info && 'secure_url' in result.info) {
                  setImg(result.info.secure_url || "");
                  setMediaType("image");
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm border border-blue-200"
                  title="Upload photo (up to 10MB)"
                >
                  <Camera size={16} />
                  <span className="font-medium">Photo</span>
                </button>
              )}
            </CldUploadWidget>

            {/* Video Upload */}
            <CldUploadWidget
              uploadPreset="social"
              options={{
                resourceType: "video",
                maxFileSize: 2000000000, // 2GB (YouTube-like limit)
              }}
              onSuccess={(result) => {
                if (typeof result.info === 'object' && result.info && 'secure_url' in result.info) {
                  setImg(result.info.secure_url || "");
                  setMediaType("video");
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors text-sm border border-purple-200"
                  title="Upload video (up to 2GB)"
                >
                  <Video size={16} />
                  <span className="font-medium">Video</span>
                </button>
              )}
            </CldUploadWidget>

            {/* Poll Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-green-600 bg-green-50 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors text-sm border border-green-200"
              onClick={() => alert('Poll feature coming soon!')}
            >
              <BarChart3 size={16} />
              <span className="font-medium">Poll</span>
            </button>

            {/* Event Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-orange-600 bg-orange-50 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors text-sm border border-orange-200"
              onClick={() => alert('Event feature coming soon!')}
            >
              <Calendar size={16} />
              <span className="font-medium">Event</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-indigo-600 bg-indigo-50 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors text-sm border border-indigo-200"
              onClick={handleShare}
            >
              <Share size={16} />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* Post Button - moved inside form for functionality */}
          <div className="flex-shrink-0">
            <AddPostButton />
          </div>
        </div>
      </form>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        shareDescription={shareDescription}
      />
    </div>
  );
};

export default AddPost;
