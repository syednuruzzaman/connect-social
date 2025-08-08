import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch posts with media (images) for the specific user
    const postsWithMedia = await prisma.post.findMany({
      where: {
        userId: userId,
        AND: [
          {
            img: {
              not: null, // Only posts that have images
            },
          },
          {
            img: {
              not: "", // Exclude empty strings
            },
          },
        ],
      },
      select: {
        id: true,
        img: true,
        desc: true,
        createdAt: true,
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
        createdAt: 'desc',
      },
      take: 8, // Limit to 8 recent media posts
    });

    return NextResponse.json(postsWithMedia);
  } catch (error) {
    console.error('Error fetching user media:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
