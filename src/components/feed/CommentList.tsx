"use client";

import { addComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
// Define Comment and User types locally if not available from @prisma/client
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

type Like = {
  id: number;
  userId: string;
  createdAt: Date;
};

type Comment = {
  id: number;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: number;
  likes?: Like[];
  _count?: {
    likes: number;
  };
};
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";
type CommentWithUser = Comment & { user: User };

const CommentList = ({
  comments,
  postId,
  onCommentAdded,
}: {
  comments: CommentWithUser[];
  postId: number;
  onCommentAdded?: () => void;
}) => {
  const { user, isLoaded } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const add = async () => {
    if (!user || !desc || !isLoaded) return;

    // Use a more stable temporary ID based on timestamp and user id
    const tempId = Date.now() + Math.random();
    const now = new Date();

    addOptimisticComment({
      id: tempId,
      desc,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
      postId: postId,
      likes: [],
      _count: {
        likes: 0,
      },
      user: {
        id: user.id,
        username: user.username || "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: null,
        description: null,
        name: user.firstName || null,
        surname: user.lastName || null,
        city: null,
        work: null,
        school: null,
        website: null,
        createdAt: now,
      },
    });
    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [createdComment, ...prev]);
      setDesc(""); // Clear the input after successful submission
      
      // Refresh the parent comments list
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/comments/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });
      
      if (response.ok) {
        // Refresh comments to show updated like status
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText("");
  };

  const submitReply = async (parentCommentId: number) => {
    if (!user || !replyText.trim()) return;

    try {
      // For now, we'll add the reply as a regular comment with @ mention
      const parentComment = comments.find(c => c.id === parentCommentId);
      const parentUsername = parentComment?.user.name && parentComment?.user.surname
        ? `${parentComment.user.name} ${parentComment.user.surname}`
        : parentComment?.user.username;
      
      const replyContent = `@${parentUsername} ${replyText}`;
      await addComment(postId, replyContent);
      
      setReplyingTo(null);
      setReplyText("");
      
      // Refresh the parent comments list
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );

  return (
    <>
      {/* Comment Input Form */}
      {isMounted && isLoaded && user ? (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-start gap-3">
            <Image
              src={user.imageUrl || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <form action={add} className="space-y-3">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none text-sm"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/emoji.png"
                      alt=""
                      width={20}
                      height={20}
                      className="cursor-pointer hover:opacity-75"
                    />
                    <span className="text-xs text-gray-500">Add emoji</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!desc.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="text-center py-4 text-gray-500 text-sm">
            Please sign in to comment on this post
          </div>
        </div>
      )}
      
      {/* Existing Comments */}
      <div className="space-y-4">
        {(isMounted ? optimisticComments : comments).length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          (isMounted ? optimisticComments : comments).map((comment) => (
            <div className="flex gap-3 py-3" key={comment.id}>
              {/* AVATAR */}
              <Image
                src={comment.user.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              {/* COMMENT CONTENT */}
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.user.name && comment.user.surname
                      ? comment.user.name + " " + comment.user.surname
                      : comment.user.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-800">
                  {comment.desc.split(' ').map((word, index) => 
                    word.startsWith('@') ? (
                      <span key={index} className="text-blue-600 font-medium">
                        {word}{' '}
                      </span>
                    ) : (
                      word + ' '
                    )
                  )}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      comment.likes && user && comment.likes.some(like => like.userId === user.id)
                        ? 'text-red-600' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Image
                      src={comment.likes && user && comment.likes.some(like => like.userId === user.id) ? "/liked.png" : "/like.png"}
                      alt=""
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                    Like {comment._count?.likes ? `(${comment._count.likes})` : ''}
                  </button>
                  <button 
                    onClick={() => handleReply(comment.id)}
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Reply
                  </button>
                </div>
                
                {/* REPLY INPUT */}
                {replyingTo === comment.id && user && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <div className="flex items-start gap-2">
                      <Image
                        src={user.imageUrl || "/noAvatar.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder={`Reply to ${comment.user.username}...`}
                          className="w-full bg-white rounded-lg p-2 border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none text-sm"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => submitReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CommentList;
