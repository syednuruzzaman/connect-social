"use client";

import { acceptFollowRequest, declineFollowRequest } from "@/lib/actions";
// Define User type if not available from @prisma/client
type User = {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  avatar?: string;
  // Add other fields if needed
};

// Define FollowRequest type if not available from @prisma/client
type FollowRequest = {
  id: number;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  // Add other fields if needed
};
import Image from "next/image";
import { useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  const [requestState, setRequestState] = useState(requests);

  const accept = async (requestId: number, userId: string) => {
    console.log("Accept not available in mobile app");
    // No optimistic updates in mobile version
    try {
      await acceptFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };
  const decline = async (requestId: number, userId: string) => {
    console.log("Decline not available in mobile app");
    // No optimistic updates in mobile version
    try {
      await declineFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };

  // Mobile-compatible state (no optimistic updates)
  const [optimisticRequests, setOptimisticRequests] = useState(requests);
  return (
    <div className="">
      {optimisticRequests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <Image
              src={request.sender.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">
              {request.sender.name && request.sender.surname
                ? request.sender.name + " " + request.sender.surname
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <button 
              className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full transition-colors opacity-50"
              title="Accept friend request (not available in mobile)"
              onClick={() => console.log("Accept not available in mobile app")}
            >
              <Image
                src="/accept.png"
                alt="Accept"
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </button>
            <button 
              className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full transition-colors opacity-50"
              title="Decline friend request (not available in mobile)"
              onClick={() => console.log("Decline not available in mobile app")}
            >
              <Image
                src="/reject.png"
                alt="Decline"
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
