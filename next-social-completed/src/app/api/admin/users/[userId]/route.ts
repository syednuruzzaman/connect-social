import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    
    // Check if current user is admin
    if (!currentUserId || currentUserId !== "user_30nQKqyDO8oYwyqyrAAf23AE1CR") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;

    // Prevent deletion of admin user
    if (userId === "user_30nQKqyDO8oYwyqyrAAf23AE1CR") {
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 400 });
    }

    // Delete user and all related data
    await prisma.$transaction(async (tx) => {
      // Delete user's posts (this will cascade to likes and comments)
      await tx.post.deleteMany({
        where: { userId },
      });

      // Delete user's stories
      await tx.story.deleteMany({
        where: { userId },
      });

      // Delete follow relationships
      await tx.follower.deleteMany({
        where: {
          OR: [
            { followerId: userId },
            { followingId: userId },
          ],
        },
      });

      // Delete follow requests
      await tx.followRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
      });

      // Delete likes and comments by user
      await tx.like.deleteMany({
        where: { userId },
      });

      await tx.comment.deleteMany({
        where: { userId },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
