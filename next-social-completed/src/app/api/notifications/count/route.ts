import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count unread notifications (likes and comments on user's posts from last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentLikesCount, recentCommentsCount, pendingRequestsCount] = await Promise.all([
      // Count recent likes on user's posts
      prisma.like.count({
        where: {
          post: {
            userId: userId,
          },
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
      }),
      
      // Count recent comments on user's posts  
      prisma.comment.count({
        where: {
          post: {
            userId: userId,
          },
          createdAt: {
            gte: twentyFourHoursAgo,
          },
          userId: {
            not: userId, // Don't count own comments
          },
        },
      }),
      
      // Count pending friend requests
      prisma.followRequest.count({
        where: {
          receiverId: userId,
        },
      }),
    ]);

    const unreadCount = recentLikesCount + recentCommentsCount + pendingRequestsCount;

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
