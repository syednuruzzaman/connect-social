import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";

const PeoplePage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get followers
  const followers = await prisma.follower.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
          description: true,
        },
      },
    },
    take: 20,
  });

  // Get following
  const following = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
          description: true,
        },
      },
    },
    take: 20,
  });

  // Get suggested users (users not followed yet)
  const suggested = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: userId } },
        {
          id: {
            notIn: following.map((f) => f.following.id),
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
      description: true,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    take: 10,
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">People</h1>
          
          <div className="space-y-8">
            {/* Suggested People */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Suggested for you
              </h2>
              {suggested.length === 0 ? (
                <p className="text-gray-500">No suggestions available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggested.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Image
                        src={user.avatar || "/noAvatar.png"}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profile/${user.username}`}
                          className="font-semibold text-gray-800 hover:underline"
                        >
                          {user.name} {user.surname}
                        </Link>
                        <p className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user._count.followers} followers
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/messages/${user.username}`}
                          className="text-blue-500 text-sm hover:underline text-center px-3 py-1 border border-blue-500 rounded hover:bg-blue-50"
                        >
                          Message
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Following */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Following ({following.length})
              </h2>
              {following.length === 0 ? (
                <p className="text-gray-500">You're not following anyone yet</p>
              ) : (
                <div className="space-y-3">
                  {following.map((follow) => (
                    <div
                      key={follow.following.id}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <Image
                        src={follow.following.avatar || "/noAvatar.png"}
                        alt={follow.following.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <Link
                          href={`/profile/${follow.following.username}`}
                          className="font-medium text-gray-800 hover:underline"
                        >
                          {follow.following.name} {follow.following.surname}
                        </Link>
                        <p className="text-sm text-gray-500">
                          @{follow.following.username}
                        </p>
                      </div>
                      <Link
                        href={`/messages/${follow.following.username}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Message
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Followers */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Followers ({followers.length})
              </h2>
              {followers.length === 0 ? (
                <p className="text-gray-500">No followers yet</p>
              ) : (
                <div className="space-y-3">
                  {followers.map((follow) => (
                    <div
                      key={follow.follower.id}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <Image
                        src={follow.follower.avatar || "/noAvatar.png"}
                        alt={follow.follower.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <Link
                          href={`/profile/${follow.follower.username}`}
                          className="font-medium text-gray-800 hover:underline"
                        >
                          {follow.follower.name} {follow.follower.surname}
                        </Link>
                        <p className="text-sm text-gray-500">
                          @{follow.follower.username}
                        </p>
                      </div>
                      <Link
                        href={`/messages/${follow.follower.username}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Message
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Following:</span>
              <span className="font-medium">{following.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium">{followers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Suggestions:</span>
              <span className="font-medium">{suggested.length}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/home.png" alt="" width={16} height={16} />
              Back to Home
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/messages.png" alt="" width={16} height={16} />
              Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
