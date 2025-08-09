"use client";

import { updateProfile } from "@/lib/actions";
// Define a User type matching the expected user object structure
type User = {
  id: string;
  name?: string | null;
  surname?: string | null;
  description?: string | null;
  city?: string | null;
  school?: string | null;
  work?: string | null;
  website?: string | null;
  cover?: string | null;
  avatar?: string | null;
  // Add other fields as needed
};
import Image from "next/image";
import { useState, useTransition } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(false);
  const [avatar, setAvatar] = useState<any>(false);

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState({ success: false, error: false });

  console.log("UpdateUser state:", state); // Debug log
  console.log("Cover:", cover); // Debug log  
  console.log("Avatar:", avatar); // Debug log

  const router = useRouter();

  // Get upload preset from environment variable with fallbacks
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "social";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Check if Cloudinary is properly configured
  const cloudinaryConfigured = uploadPreset && cloudName;

  const handleUploadError = (error: any, type: string) => {
    console.error(`${type} upload error:`, error);
    
    if (error.message?.includes('Upload preset not found') || error.message?.includes('Invalid upload preset')) {
      alert(`❌ Upload Failed: Upload preset "${uploadPreset}" not found.\n\n🔧 Quick Fix:\n1. Go to https://cloudinary.com/console\n2. Settings → Upload → Add upload preset\n3. Name it "social" and set mode to "Unsigned"\n4. Try uploading again\n\n📖 See CLOUDINARY_SETUP.md for detailed instructions.`);
    } else if (error.message?.includes('Invalid cloud name')) {
      alert(`❌ Upload Failed: Invalid cloud name "${cloudName}".\n\nPlease check your NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local file.`);
    } else if (error.message?.includes('File size too large')) {
      alert(`❌ Upload Failed: File size is too large.\n\nPlease choose an image smaller than 10MB.`);
    } else {
      alert(`❌ Upload Failed: ${error.message || 'Unknown error'}\n\nPlease check:\n- Internet connection\n- File size (max 10MB)\n- File format (jpg, png, gif, webp)\n- Cloudinary configuration`);
    }
  };

  const handleClose = () => {
    setOpen(false);
    state.success && router.refresh();
  };

  return (
    <div className="">
      <span
        className="text-blue-500 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Update
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50 ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const coverUrl = cover?.secure_url || user.cover || "";
              const avatarUrl = avatar?.secure_url || user.avatar || "";
              console.log("Form submission:", { coverUrl, avatarUrl, cover, avatar }); // Debug log
              startTransition(async () => {
                try {
                  await updateProfile(state, { 
                    formData, 
                    cover: coverUrl, 
                    avatar: avatarUrl 
                  });
                  setState({ success: true, error: false });
                } catch (error) {
                  setState({ success: false, error: true });
                }
              });
            }}
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
          >
            {/* TITLE */}
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Update your profile information below.
            </div>
            
            {/* AVATAR UPLOAD */}
            {!cloudinaryConfigured ? (
              <div className="flex flex-col gap-4 my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="text-red-600 font-semibold">⚠️ Profile Picture Upload Unavailable</label>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Cloudinary is not properly configured.</p>
                  <p className="mb-2"><strong>Missing:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    {!cloudName && <li>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</li>}
                    {!uploadPreset && <li>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</li>}
                  </ul>
                  <p className="mt-2">📖 See <code>CLOUDINARY_SETUP.md</code> for setup instructions.</p>
                </div>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => setAvatar(result.info)}
                onError={(error) => handleUploadError(error, "Avatar")}
                options={{
                  sources: ['local', 'camera'],
                  multiple: false,
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                  maxFileSize: 10000000, // 10MB
                  cropping: true,
                  croppingAspectRatio: 1, // Square aspect ratio for avatars
                  folder: "social_avatars",
                }}
              >
              {({ open }) => {
                return (
                  <div
                    className="flex flex-col gap-4 my-4"
                    onClick={() => open()}
                  >
                    <label htmlFor="">Profile Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src={avatar?.secure_url || user.avatar || "/noAvatar.png"}
                        alt=""
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-xs underline text-gray-600">
                        Change Avatar
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
            )}
            
            {/* COVER PIC UPLOAD */}
            {!cloudinaryConfigured ? (
              <div className="flex flex-col gap-4 my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="text-red-600 font-semibold">⚠️ Cover Picture Upload Unavailable</label>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Cloudinary is not properly configured.</p>
                  <p className="mb-2"><strong>Missing:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    {!cloudName && <li>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</li>}
                    {!uploadPreset && <li>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</li>}
                  </ul>
                  <p className="mt-2">📖 See <code>CLOUDINARY_SETUP.md</code> for setup instructions.</p>
                </div>
              </div>
            ) : (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                onSuccess={(result) => setCover(result.info)}
                onError={(error) => handleUploadError(error, "Cover")}
                options={{
                  sources: ['local', 'camera'],
                  multiple: false,
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                  maxFileSize: 10000000, // 10MB
                  cropping: true,
                  croppingAspectRatio: 16/9, // Wide aspect ratio for covers
                  folder: "social_covers",
                }}
              >
              {({ open }) => {
                return (
                  <div
                    className="flex flex-col gap-4 my-4"
                    onClick={() => open()}
                  >
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src={cover?.secure_url || user.cover || "/noCover.png"}
                        alt=""
                        width={48}
                        height={32}
                        className="w-12 h-8 rounded-md object-cover"
                      />
                      <span className="text-xs underline text-gray-600">
                        Change Cover
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
            )}

            {/* WRAPPER */}
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder={user.name || "John"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Surname
                </label>
                <input
                  type="text"
                  placeholder={user.surname || "Doe"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="surname"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  placeholder={user.description || "Life is beautiful..."}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="description"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  placeholder={user.city || "New York"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="city"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  School
                </label>
                <input
                  type="text"
                  placeholder={user.school || "MIT"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="school"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Work
                </label>
                <input
                  type="text"
                  placeholder={user.work || "Apple Inc."}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="work"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="" className="text-xs text-gray-500">
                  Website
                </label>
                <input
                  type="text"
                  placeholder={user.website || "connect.dev"}
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="website"
                />
              </div>
            </div>
            <UpdateButton/>
            {state.success && (
              <span className="text-green-500">Profile has been updated!</span>
            )}
            {state.error && (
              <span className="text-red-500">Something went wrong!</span>
            )}
            <div
              className="absolute text-xl right-2 top-3 cursor-pointer"
              onClick={handleClose}
            >
              X
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
