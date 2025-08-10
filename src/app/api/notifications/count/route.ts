import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch unread notification count
export async function GET(req: NextRequest) {
  try {
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ unreadCount: 0 });
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ unreadCount: 0 });
    }

    // For now, return 0 since we don't have a notifications table yet
    // This can be expanded later when notifications are implemented
    const unreadCount = 0;

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json({ unreadCount: 0 }, { status: 200 });
  }
}
