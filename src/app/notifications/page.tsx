import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import Link from "next/link";

const NotificationsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get recent likes on user's posts
  const recentLikes = await prisma.like.findMany({
    where: {
      post: {
        userId: userId,
      },
    },
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
      post: {
        select: {
          id: true,
          desc: true,
          img: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get recent comments on user's posts
  const recentComments = await prisma.comment.findMany({
    where: {
      post: {
        userId: userId,
      },
    },
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
      post: {
        select: {
          id: true,
          desc: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Get recent follow requests
  const followRequests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
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
      createdAt: "desc",
    },
  });

  // Combine and sort all notifications
  const allNotifications = [
    ...recentLikes.map((like) => ({
      id: `like-${like.id}`,
      type: "like",
      user: like.user,
      post: like.post,
      createdAt: like.createdAt,
    })),
    ...recentComments.map((comment) => ({
      id: `comment-${comment.id}`,
      type: "comment",
      user: comment.user,
      post: comment.post,
      comment: comment.desc,
      createdAt: comment.createdAt,
    })),
    ...followRequests.map((request) => ({
      id: `follow-${request.id}`,
      type: "follow_request",
      user: request.sender,
      createdAt: request.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
          
          {allNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="/notifications.png"
                alt="No notifications"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500 mb-4">No notifications yet</p>
              <p className="text-sm text-gray-400">
                When people interact with your posts, you'll see notifications here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Image
                    src={notification.user.avatar || "/noAvatar.png"}
                    alt={notification.user.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {notification.type === "like" && (
                        <Image src="/like.png" alt="Like" width={16} height={16} />
                      )}
                      {notification.type === "comment" && (
                        <Image src="/comment.png" alt="Comment" width={16} height={16} />
                      )}
                      {notification.type === "follow_request" && (
                        <Image src="/people.png" alt="Follow" width={16} height={16} />
                      )}
                    </div>
                    <p className="text-sm">
                      <Link
                        href={`/profile/${notification.user.username}`}
                        className="font-semibold hover:underline"
                      >
                        {notification.user.name} {notification.user.surname}
                      </Link>
                      {notification.type === "like" && " liked your post"}
                      {notification.type === "comment" && " commented on your post"}
                      {notification.type === "follow_request" && " wants to follow you"}
                    </p>
                    {notification.type === "comment" && (
                      <p className="text-xs text-gray-600 mt-1">
                        "{(notification as any).comment}"
                      </p>
                    )}
                    {(notification as any).post && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        "{(notification as any).post.desc}"
                      </p>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              href="/messages"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <Image src="/messages.png" alt="" width={16} height={16} />
              Messages
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

export default NotificationsPage;
