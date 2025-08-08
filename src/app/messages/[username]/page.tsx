import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { markMessagesAsRead } from "@/lib/actions";

const ChatPage = async ({ params }: { params: { username: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get the user we're chatting with
  const chatUser = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
    },
  });

  if (!chatUser) {
    notFound();
  }

  // Allow messaging between any users (removed mutual follower restriction)
  // Get or create conversation
  let conversation = null;
  let messages: any[] = [];

  conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: chatUser.id },
          { user1Id: chatUser.id, user2Id: userId },
        ],
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
                name: true,
                surname: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          user1Id: userId,
          user2Id: chatUser.id,
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  name: true,
                  surname: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }

    messages = conversation.messages;

    // Mark messages as read
    if (conversation.id) {
      await markMessagesAsRead(conversation.id);
    }

  return (
    <div className="flex gap-6 pt-6 h-screen">
      <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-4 flex items-center gap-4 flex-shrink-0">
            <Link href="/messages" className="hover:bg-blue-600 p-1 rounded">
              <Image src="/home.png" alt="Back" width={20} height={20} className="invert" />
            </Link>
            <Image
              src={chatUser.avatar || "/noAvatar.png"}
              alt={chatUser.username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">
                {chatUser.name && chatUser.surname 
                  ? `${chatUser.name} ${chatUser.surname}` 
                  : chatUser.username}
              </div>
              <div className="text-sm opacity-80">@{chatUser.username}</div>
            </div>
          </div>

          {/* Chat Content */}
          <ChatInterface 
            conversation={conversation}
            messages={messages}
            currentUserId={userId}
            chatUser={chatUser}
          />
        </div>
      </div>

      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Chat Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src={chatUser.avatar || "/noAvatar.png"}
                alt={chatUser.username}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">
                  {chatUser.name && chatUser.surname 
                    ? `${chatUser.name} ${chatUser.surname}` 
                    : chatUser.username}
                </div>
                <div className="text-sm text-gray-500">@{chatUser.username}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t space-y-2">
              <Link
                href={`/profile/${chatUser.username}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Image src="/people.png" alt="" width={16} height={16} />
                View Profile
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Image src="/messages.png" alt="" width={16} height={16} />
                All Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
