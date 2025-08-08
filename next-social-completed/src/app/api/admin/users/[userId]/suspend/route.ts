import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/client';

export async function POST(
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

    // Prevent suspension of admin user
    if (userId === "user_30nQKqyDO8oYwyqyrAAf23AE1CR") {
      return NextResponse.json({ error: 'Cannot suspend admin user' }, { status: 400 });
    }

    // For now, we'll update the user's description to indicate suspension
    // In a real app, you might have a 'suspended' field in the user table
    await prisma.user.update({
      where: { id: userId },
      data: {
        description: '[SUSPENDED BY ADMIN] ' + (await prisma.user.findUnique({
          where: { id: userId },
          select: { description: true }
        }))?.description || '',
      },
    });

    return NextResponse.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Error suspending user:', error);
    return NextResponse.json(
      { error: 'Failed to suspend user' },
      { status: 500 }
    );
  }
}
