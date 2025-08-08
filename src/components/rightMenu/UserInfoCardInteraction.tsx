"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { useState } from "react";
import Link from "next/link";

const UserInfoCardInteraction = ({
  userId,
  username,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  username: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  const follow = async () => {
    console.log("Follow action not available in mobile app");
    // No optimistic updates in mobile version
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: prev.following && false,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent ? true : false,
      }));
    } catch (err) {}
  };

  const block = async () => {
    console.log("Block action not available in mobile app");
    // No optimistic updates in mobile version
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (err) {}
  };

  // Mobile-compatible state (no optimistic updates)
  const [optimisticState, setOptimisticState] = useState(userState);
  return (
    <>
      <button 
        className="w-full bg-blue-500 text-white text-sm rounded-md p-2 hover:bg-blue-600 transition-colors opacity-50"
        onClick={() => console.log("Follow action not available in mobile app")}
      >
        {optimisticState.following
          ? "Following"
          : optimisticState.followingRequestSent
          ? "Friend Request Sent"
          : "Follow"}
      </button>
      
      {/* Message Button */}
      <Link 
        href={`/messages/${username}`}
        className="w-full bg-green-500 text-white text-sm rounded-md p-2 hover:bg-green-600 transition-colors text-center block"
      >
        💬 Send Message
      </Link>
      
      <button className="self-end" onClick={() => console.log("Block action not available in mobile app")}>
        <span className="text-red-400 text-xs cursor-pointer opacity-50">
          {optimisticState.blocked ? "Unblock User" : "Block User"}
        </span>
      </button>
    </>
  );
};

export default UserInfoCardInteraction;
