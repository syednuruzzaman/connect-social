import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import AdminUserActions from "@/components/admin/AdminUserActions";
import AdminStats from "@/components/admin/AdminStats";

const AdminDashboard = async () => {
  const { userId } = auth();

  // Check if user is admin (Syed Nuruzzaman)
  if (!userId || userId !== "user_30nQKqyDO8oYwyqyrAAf23AE1CR") {
    redirect("/");
  }

  // Get all users with stats
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
      description: true,
      city: true,
      work: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true,
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get recent posts for moderation
  const recentPosts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get pending follow requests (all of them for admin overview)
  const followRequests = await prisma.followRequest.findMany({
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
      receiver: {
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
      createdAt: "desc",
    },
  });

  // Get system stats
  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.follower.count(),
    prisma.like.count(),
    prisma.comment.count(),
    prisma.story.count(),
    prisma.followRequest.count(),
  ]);

  const [totalUsers, totalPosts, totalFollows, totalLikes, totalComments, totalStories, totalRequests] = stats;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                ADMIN
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Connect Admin Dashboard</h1>
            </div>
            <Link
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <AdminStats
          totalUsers={totalUsers}
          totalPosts={totalPosts}
          totalFollows={totalFollows}
          totalLikes={totalLikes}
          totalComments={totalComments}
          totalStories={totalStories}
          totalRequests={totalRequests}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">User Management</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={user.avatar || "/noAvatar.png"}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user.name} {user.surname}
                          {user.id === "user_30nQKqyDO8oYwyqyrAAf23AE1CR" && (
                            <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                        <div className="text-xs text-gray-400">
                          {user._count.posts} posts • {user._count.followers} followers
                        </div>
                        <div className="text-xs text-gray-400">
                          Joined: {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                    <AdminUserActions userId={user.id} username={user.username} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts Moderation */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Posts (Moderation)</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <Image
                        src={post.user.avatar || "/noAvatar.png"}
                        alt={post.user.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{post.user.name} {post.user.surname}</span>
                          <span className="text-sm text-gray-500">@{post.user.username}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{post.desc}</p>
                        {post.img && (
                          <Image
                            src={post.img}
                            alt="Post image"
                            width={200}
                            height={150}
                            className="rounded-lg object-cover mb-2"
                          />
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{post._count.likes} likes</span>
                          <span>{post._count.comments} comments</span>
                          <button className="text-red-500 hover:text-red-700">Delete Post</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="space-y-6">
            {/* Follow Requests Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Follow Requests</h3>
              {followRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {followRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="text-sm">
                      <span className="font-medium">{request.sender.name}</span>
                      <span className="text-gray-500"> → </span>
                      <span className="font-medium">{request.receiver.name}</span>
                    </div>
                  ))}
                  {followRequests.length > 5 && (
                    <p className="text-xs text-gray-500">
                      +{followRequests.length - 5} more requests
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-sm">
                  Export User Data
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 text-sm">
                  Generate Report
                </button>
                <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 text-sm">
                  System Backup
                </button>
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 text-sm">
                  Send Announcement
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">System Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Server Status:</span>
                  <span className="text-green-500 font-medium">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="text-green-500 font-medium">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Backup:</span>
                  <span className="font-medium">Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
