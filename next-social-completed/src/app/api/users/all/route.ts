import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users except the current user
    const users = await prisma.user.findMany({
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

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
