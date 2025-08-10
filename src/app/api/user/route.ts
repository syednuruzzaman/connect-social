import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Check if user exists in database
export async function GET() {
  try {
    // Check if we're in build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ exists: false, user: null });
    }

    const prisma = (await import("@/lib/client")).default;
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({ exists: !!user, user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ exists: false, user: null }, { status: 200 });
  }
}

// POST - Create user in database
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
    const { username, name, surname, description, city, school, work, website } = body;

    const user = await prisma.user.create({
      data: {
        id: userId,
        username,
        name,
        surname,
        description: description || "",
        city: city || "",
        school: school || "",
        work: work || "",
        website: website || "",
        avatar: "/noAvatar.png",
        cover: "/noCover.png",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
