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

type Comment = {
  id: number;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: number;
};
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";
type CommentWithUser = Comment & { user: User };

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) => {
  const { user, isLoaded } = useUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");
  const [isMounted, setIsMounted] = useState(false);

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
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );

  return (
    <>
      {/* Only show comment form if user is loaded and authenticated */}
      {isMounted && isLoaded && user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/emoji.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}
      
      {/* Always show existing comments - they are static server data */}
      <div className="">
        {/* COMMENT */}
        {(isMounted ? optimisticComments : comments).map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* AVATAR */}
            <Image
              src={comment.user.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            {/* DESC */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? comment.user.name + " " + comment.user.surname
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt=""
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div className="">Reply</div>
              </div>
            </div>
            {/* ICON */}
            <Image
              src="/more.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            ></Image>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
