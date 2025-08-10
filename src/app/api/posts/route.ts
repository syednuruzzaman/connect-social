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
    console.log("POST /api/posts - Request received");
    
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      console.log("Database not available");
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();
    
    console.log("User ID:", userId);
    
    if (!userId) {
      console.log("User not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { desc, img } = body;
    
    console.log("Post data:", { desc, img, userId });

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

    console.log("Post created successfully:", post.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(req: NextRequest) {
  try {
    console.log("DELETE /api/posts - Request received");
    
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      console.log("Database not available");
      return NextResponse.json({ error: "Database not available" }, { status: 503 });
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();
    
    console.log("User ID:", userId);
    
    if (!userId) {
      console.log("User not authenticated");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postIdStr = searchParams.get('id');
    
    if (!postIdStr) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postId = parseInt(postIdStr);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    console.log("Deleting post ID:", postId);

    // First check if the post exists and belongs to the user
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.userId !== userId) {
      return NextResponse.json({ error: "You can only delete your own posts" }, { status: 403 });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId }
    });

    console.log("Post deleted successfully:", postId);
    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
