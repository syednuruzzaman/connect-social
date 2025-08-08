import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds, shareUrl, shareTitle, shareDescription } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "User IDs are required" }, { status: 400 });
    }

    // For now, we'll just return success
    // In a real app, you'd send messages or notifications to connect with users
    
    console.log(`User ${userId} shared "${shareTitle}" with users:`, userIds);

    return NextResponse.json({ 
      success: true, 
      message: `Shared with ${userIds.length} user${userIds.length > 1 ? 's' : ''}` 
    });
  } catch (error) {
    console.error("Error sharing with users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
