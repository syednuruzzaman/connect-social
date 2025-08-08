"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserMediaCard = ({ user }: { user: { id: string } }) => {
  const [postsWithMedia, setPostsWithMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/${user.id}/media`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        
        const data = await res.json();
        setPostsWithMedia(data);
      } catch (error) {
        console.error('Error fetching user media:', error);
        setError('Failed to load media');
        setPostsWithMedia([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user.id) {
      fetchPosts();
    }
  }, [user.id]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      
      {/* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {loading ? (
          // Loading state
          <div className="w-full text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-2">Loading media...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="w-full text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : postsWithMedia.length > 0 ? (
          // Media found
          postsWithMedia.map((post) => (
            <div className="relative w-1/5 h-24" key={post.id}>
              <Image
                src={post.img!}
                alt={post.desc || "User media"}
                fill
                className="object-cover rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                title={post.desc || "User media"}
              />
            </div>
          ))
        ) : (
          // No media found
          <div className="w-full text-center py-4">
            <div className="text-gray-400 mb-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 mx-auto" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <p className="text-gray-500">No media found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMediaCard;
