"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { createStory } from "@/lib/actions";
import { X, Camera, Video, Type, Globe, Users, UserCheck, Palette, Upload, Trash2, Plus } from "lucide-react";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: any) => void;
}

const StoryModal = ({ isOpen, onClose, onStoryCreated }: StoryModalProps) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"photo" | "video" | "text">("photo");
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "text">("image");
  const [privacy, setPrivacy] = useState<"public" | "friends" | "custom">("public");
  const [customViewers, setCustomViewers] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState("#3B82F6");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const backgroundColors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", 
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];

  const textColors = ["#FFFFFF", "#000000", "#374151", "#F3F4F6"];

  const handleDeleteMedia = () => {
    setMediaUrl("");
  };

  const handleSubmit = async () => {
    if (!text && !mediaUrl) return;
    
    setLoading(true);
    try {
      const storyData = {
        text: text || undefined,
        img: mediaType === "image" ? mediaUrl : undefined,
        video: mediaType === "video" ? mediaUrl : undefined,
        mediaType: mediaUrl ? mediaType : "text" as "image" | "video" | "text",
        privacy: privacy as "public" | "friends" | "custom",
        customViewers: privacy === "custom" ? customViewers : undefined,
        backgroundColor: activeTab === "text" ? backgroundColor : undefined,
        textColor: activeTab === "text" ? textColor : undefined,
      };

      const newStory = await createStory(storyData);
      if (newStory) {
        onStoryCreated(newStory);
        onClose();
        // Reset form
        setText("");
        setMediaUrl("");
        setPrivacy("public");
        setCustomViewers([]);
      }
    } catch (error) {
      console.error("Failed to create story:", error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-lg font-bold">Create Your Story</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content Type Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => {setActiveTab("photo"); setMediaType("image");}}
            className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === "photo" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Camera size={18} />
            Photo
          </button>
          <button
            onClick={() => {setActiveTab("video"); setMediaType("video");}}
            className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === "video" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Video size={18} />
            Video
          </button>
          <button
            onClick={() => {setActiveTab("text"); setMediaType("text");}}
            className={`flex-1 p-3 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === "text" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Type size={18} />
            Text
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Content Area */}
          {activeTab === "text" ? (
            <div className="space-y-4">
              {/* Text Story Preview */}
              <div 
                className="h-64 rounded-lg flex items-center justify-center p-4 relative overflow-hidden"
                style={{ backgroundColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-10"></div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-full bg-transparent resize-none outline-none text-center text-xl font-medium placeholder-opacity-70"
                  style={{ color: textColor }}
                  maxLength={200}
                />
              </div>

              {/* Color Customization */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex flex-wrap gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          backgroundColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <div className="flex gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          textColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Media Upload */}
              <CldUploadWidget
                uploadPreset="social"
                options={{
                  resourceType: activeTab === "video" ? "video" : "image",
                  maxFileSize: activeTab === "video" ? 100000000 : 10000000, // 100MB for video, 10MB for image
                }}
                onSuccess={(result) => {
                  if (typeof result.info === 'object' && result.info && 'secure_url' in result.info) {
                    setMediaUrl(result.info.secure_url || "");
                  }
                }}
              >
                {({ open }) => (
                  <div
                    onClick={() => open()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    {mediaUrl ? (
                      <div className="space-y-2 relative">
                        {activeTab === "video" ? (
                          <video src={mediaUrl} className="w-full h-48 object-cover rounded-lg" controls />
                        ) : (
                          <Image src={mediaUrl} alt="Preview" width={200} height={200} className="w-full h-48 object-cover rounded-lg" />
                        )}
                        
                        {/* Delete and Replace buttons */}
                        <div className="flex gap-2 justify-center mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedia();
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              open();
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Plus size={14} />
                            Replace
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-gray-600 font-medium">Click to upload {activeTab}</p>
                        <p className="text-xs text-gray-400">
                          {activeTab === "video" ? "Max 100MB" : "Max 10MB"}
                        </p>
                        <p className="text-xs text-blue-500 font-medium">
                          The blue circle with + icon is for uploading your {activeTab}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>

              {/* Caption for media */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a caption..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                maxLength={200}
              />
            </div>
          )}

          {/* Privacy Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Who can see this story?</label>
            <div className="relative">
              <button
                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <div className="flex items-center gap-2">
                  {privacy === "public" && <Globe size={18} className="text-green-600" />}
                  {privacy === "friends" && <Users size={18} className="text-blue-600" />}
                  {privacy === "custom" && <UserCheck size={18} className="text-purple-600" />}
                  <span className="capitalize">{privacy}</span>
                </div>
                <span className="text-gray-400">▼</span>
              </button>

              {showPrivacyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {setPrivacy("public"); setShowPrivacyDropdown(false);}}
                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Globe size={18} className="text-green-600" />
                    <div>
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-gray-500">Anyone can see</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {setPrivacy("friends"); setShowPrivacyDropdown(false);}}
                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Users size={18} className="text-blue-600" />
                    <div>
                      <div className="font-medium">Friends</div>
                      <div className="text-xs text-gray-500">Only people you follow</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {setPrivacy("custom"); setShowPrivacyDropdown(false);}}
                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <UserCheck size={18} className="text-purple-600" />
                    <div>
                      <div className="font-medium">Custom</div>
                      <div className="text-xs text-gray-500">Select specific people</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!text && !mediaUrl)}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Sharing..." : "Share Story"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
