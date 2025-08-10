"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useUser } from "@clerk/nextjs";
import Post from "@/components/feed/Post";

interface PostData {
  id: number;
  desc: string;
  img?: string | null;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    name?: string | null;
    surname?: string | null;
    avatar?: string | null;
  };
  likes: [{ userId: string }];
  _count: {
    comments: number;
  };
}

interface ClientFeedProps {
  username?: string;
}

interface ClientFeedRef {
  refreshFeed: () => void;
}

const ClientFeed = forwardRef<ClientFeedRef, ClientFeedProps>(({ username }, ref) => {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      const url = username ? `/api/posts?username=${username}` : '/api/posts';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Expose refreshFeed function to parent component
  useImperativeHandle(ref, () => ({
    refreshFeed: fetchPosts
  }));

  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post');
      }

      // Remove the post from the local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const refreshFeed = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [username, isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Error Loading Feed</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-gray-600 font-semibold text-lg">No Posts Yet</h3>
        <p className="text-gray-500 mt-2">
          {username ? "This user hasn't posted anything yet." : "Start following people or create your first post!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post 
          key={post.id} 
          post={post} 
          onDelete={handleDeletePost}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
});

ClientFeed.displayName = 'ClientFeed';

export default ClientFeed;
