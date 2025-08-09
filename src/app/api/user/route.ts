import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

// GET - Check if user exists in database
export async function GET() {
  try {
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
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}

// POST - Create user in database
export async function POST(req: NextRequest) {
  try {
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
