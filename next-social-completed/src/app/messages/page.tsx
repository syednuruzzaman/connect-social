import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import UserSelector from "@/components/UserSelector";

const MessagesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get conversations with recent messages
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    },
    include: {
      user1: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
        },
      },
      user2: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Get all users who can be messaged (everyone except current user)
  const availableUsers = await prisma.user.findMany({
    where: {
      id: {
        not: userId
      }
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
    },
    take: 8, // Show first 8 for quick access
    orderBy: [
      { name: 'asc' },
      { username: 'asc' }
    ]
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <UserSelector currentUserId={userId} />
          </div>
          
          {/* Existing Conversations */}
          {conversations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Conversations</h2>
              <div className="space-y-3">
                {conversations.map((conversation) => {
                  // Determine the other user in the conversation
                  const otherUser = conversation.user1Id === userId 
                    ? conversation.user2 
                    : conversation.user1;
                  
                  const lastMessage = conversation.messages[0];
                  
                  return (
                    <Link
                      key={conversation.id}
                      href={`/messages/${otherUser.username}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                    >
                      <Image
                        src={otherUser.avatar || "/noAvatar.png"}
                        alt={otherUser.username}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800">
                          {otherUser.name && otherUser.surname 
                            ? `${otherUser.name} ${otherUser.surname}`
                            : otherUser.username
                          }
                        </div>
                        <div className="text-sm text-gray-500">@{otherUser.username}</div>
                        {lastMessage && (
                          <div className="text-sm text-gray-600 truncate mt-1">
                            {lastMessage.sender.id === userId ? "You: " : ""}
                            {lastMessage.content}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lastMessage 
                          ? new Date(lastMessage.createdAt).toISOString().split('T')[0]
                          : "New chat"
                        }
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available People to Message */}
          {availableUsers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Start Conversations</h2>
              <div className="space-y-3">
                {availableUsers.map((user) => (
                  <Link
                    key={user.id}
                    href={`/messages/${user.username}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                  >
                    <Image
                      src={user.avatar || "/noAvatar.png"}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {user.name && user.surname 
                          ? `${user.name} ${user.surname}`
                          : user.username
                        }
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Start chat
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {conversations.length === 0 && availableUsers.length === 0 && (
            <div className="text-center py-12">
              <Image
                src="/messages.png"
                alt="No messages"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 mb-4">No conversations yet</p>
              <p className="text-sm text-gray-400">
                Use the "New Message" button above to start chatting!
              </p>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💬 Enhanced Messaging Features:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>New Message Button:</strong> Select any user to start chatting</li>
              <li>• <strong>Message All Users:</strong> Access to broadcast messaging</li>
              <li>• <strong>No Restrictions:</strong> Message anyone, no follow requirement</li>
              <li>• <strong>Real-time:</strong> Instant message delivery and history</li>
              <li>• <strong>Search Users:</strong> Find people quickly in the dropdown</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/home.png" alt="" width={16} height={16} />
              Back to Home
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/settings.png" alt="" width={16} height={16} />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
