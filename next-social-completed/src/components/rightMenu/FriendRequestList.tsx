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
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  const [requestState, setRequestState] = useState(requests);

  const accept = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await acceptFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };
  const decline = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await declineFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: number) => state.filter((req) => req.id !== value)
  );
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
            <form action={() => accept(request.id, request.sender.id)}>
              <button 
                type="submit"
                className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                title="Accept friend request"
              >
                <Image
                  src="/accept.png"
                  alt="Accept"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </button>
            </form>
            <form action={() => decline(request.id, request.sender.id)}>
              <button 
                type="submit"
                className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                title="Decline friend request"
              >
                <Image
                  src="/reject.png"
                  alt="Decline"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
