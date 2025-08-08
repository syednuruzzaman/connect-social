import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";

const BroadcastMessagesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get all users except current user
  const allUsers = await prisma.user.findMany({
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
    orderBy: [
      { name: 'asc' },
      { username: 'asc' }
    ]
  });

  return (
    <div className="flex gap-6 pt-6 h-screen">
      <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col min-h-0 max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 flex items-center gap-4 flex-shrink-0">
            <Link href="/messages" className="hover:bg-blue-600 p-1 rounded">
              <Image src="/home.png" alt="Back" width={20} height={20} className="invert" />
            </Link>
            <h1 className="text-xl font-bold">Message All Users</h1>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📢 Broadcast Message</h3>
              <p className="text-sm text-blue-700">
                Select users below to start individual conversations with them. 
                You can send the same message to multiple people.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                All Users ({allUsers.length})
              </h2>
              
              {allUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No other users found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allUsers.map((user) => (
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
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800">
                          {user.name && user.surname 
                            ? `${user.name} ${user.surname}`
                            : user.username
                          }
                        </div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-blue-500 text-xs mt-1">
                          Click to message →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4 h-fit">
          <h3 className="font-semibold mb-4">Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="p-3 bg-gray-50 rounded">
              <p>💡 Click on any user to start a conversation with them.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p>🔍 You can message any user, regardless of follow status.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p>💬 Each conversation is private and secure.</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <Link
              href="/messages"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/messages.png" alt="" width={16} height={16} />
              Back to Messages
            </Link>
            <Link
              href="/people"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/people.png" alt="" width={16} height={16} />
              Browse People
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastMessagesPage;
