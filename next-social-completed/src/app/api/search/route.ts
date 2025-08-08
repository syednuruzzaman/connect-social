import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search for users by username, name, surname
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
            },
          },
          {
            name: {
              contains: query,
            },
          },
          {
            surname: {
              contains: query,
            },
          },
        ],
        // Exclude the current user from search results
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        avatar: true,
      },
      take: 10, // Limit results to 10
    });

    // Format results
    const results = users.map((user) => ({
      id: user.id,
      name: `${user.name || ""} ${user.surname || ""}`.trim() || user.username,
      username: user.username,
      avatar: user.avatar || "/noAvatar.png",
      type: "user" as const,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
