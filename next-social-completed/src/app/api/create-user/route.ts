import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

export async function POST() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'User already exists', 
        user: existingUser 
      });
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username: user.username || `user_${userId.slice(-8)}`,
        name: user.firstName || '',
        surname: user.lastName || '',
        avatar: user.imageUrl || '/noAvatar.png',
        cover: '/noCover.png',
      },
    });

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ 
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
