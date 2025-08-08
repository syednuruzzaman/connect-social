import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        name: true,
        surname: true,
        description: true,
      },
    });

    return NextResponse.json({ 
      exists: !!user,
      user: user 
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}
