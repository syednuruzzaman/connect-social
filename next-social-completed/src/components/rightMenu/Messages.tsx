import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";

const Messages = async () => {
  const { userId } = auth();

  if (!userId) return null;

  // Get recent conversations (mutual followers)
  const recentConversations = await prisma.user.findMany({
    where: {
      AND: [
        {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
        {
          followings: {
            some: {
              followingId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
    },
    take: 4,
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Messages</span>
        <Link href="/messages" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      
      <div className="flex flex-col gap-4 mt-4">
        {recentConversations.length === 0 ? (
          <div className="text-center py-4">
            <Image
              src="/messages.png"
              alt="No messages"
              width={32}
              height={32}
              className="mx-auto mb-2 opacity-50"
            />
            <p className="text-xs text-gray-500">No conversations yet</p>
            <Link
              href="/messages"
              className="text-xs text-blue-500 hover:underline"
            >
              Start chatting
            </Link>
          </div>
        ) : (
          recentConversations.map((user) => (
            <Link
              key={user.id}
              href={`/messages/${user.username}`}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <Image
                src={user.avatar || "/noAvatar.png"}
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {user.name} {user.surname}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  @{user.username}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
