import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

export async function GET() {
  try {
    // Simple test query
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      success: true, 
      message: `Database connected! Found ${userCount} users.`,
      userCount 
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
