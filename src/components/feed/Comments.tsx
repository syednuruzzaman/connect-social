"use client";

import { useEffect, useState } from "react";
import CommentList from "./CommentList";

// Define types to match the expected structure
type User = {
  id: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  description: string | null;
  name: string | null;
  surname: string | null;
  city: string | null;
  work: string | null;
  school: string | null;
  website: string | null;
  createdAt: Date;
};

type Comment = {
  id: number;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: number;
  user: User;
};

const Comments = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Function to refresh comments when a new comment is added
  const refreshComments = () => {
    fetchComments();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm">Loading comments...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">Comments</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </div>
      <CommentList 
        comments={comments} 
        postId={postId} 
        onCommentAdded={refreshComments}
      />
    </div>
  );
};

export default Comments;
