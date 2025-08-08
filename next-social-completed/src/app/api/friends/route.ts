import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get friends (people the user follows and who follow them back)
    const friends = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: userId,
          },
        },
        followings: {
          some: {
            followingId: userId,
          },
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        avatar: true,
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
