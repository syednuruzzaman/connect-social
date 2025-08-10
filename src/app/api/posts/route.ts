import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch posts for feed
export async function GET(req: NextRequest) {
  try {
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    let posts: any[] = [];

    if (username) {
      posts = await prisma.post.findMany({
        where: {
          user: {
            username: username,
          },
        },
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (userId) {
      const following = await prisma.follower.findMany({
        where: {
          followerId: userId,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = following.map((f) => f.followingId);
      const ids = [userId, ...followingIds];

      posts = await prisma.post.findMany({
        where: {
          userId: {
            in: ids,
          },
        },
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create new post
export async function POST(req: NextRequest) {
  try {
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { desc, img } = body;

    const post = await prisma.post.create({
      data: {
        desc,
        img: img || "",
        userId,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
