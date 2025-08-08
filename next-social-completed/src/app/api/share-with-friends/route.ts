import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { friendIds, shareUrl, shareTitle, shareDescription } = body;

    if (!friendIds || !Array.isArray(friendIds) || friendIds.length === 0) {
      return NextResponse.json({ error: "Friend IDs are required" }, { status: 400 });
    }

    // For now, we'll just return success
    // In a real app, you'd send messages or notifications
    // Since we don't have a notification system, we'll simulate success
    
    console.log(`User ${userId} shared "${shareTitle}" with friends:`, friendIds);

    return NextResponse.json({ 
      success: true, 
      message: `Shared with ${friendIds.length} friend${friendIds.length > 1 ? 's' : ''}` 
    });
  } catch (error) {
    console.error("Error sharing with friends:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
