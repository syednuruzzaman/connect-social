"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Helper function to ensure user exists in database
const ensureUserExists = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!existingUser) {
    // If user doesn't exist, create a basic user record
    // This handles cases where webhook might not have fired
    try {
      await prisma.user.create({
        data: {
          id: userId,
          username: `user_${userId.slice(-8)}`, // Generate a username from user ID
          avatar: "/noAvatar.png",
          cover: "/noCover.png",
          name: "Dev User",
          surname: "Test",
        },
      });
      console.log(`✅ Created new user in database: ${userId}`);
    } catch (error) {
      // User might have been created by another request, ignore duplicate error
      console.log("User creation skipped, might already exist:", error);
    }
  }
};

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    // Ensure both users exist in database
    await ensureUserExists(currentUserId);
    await ensureUserExists(userId);
    
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
    revalidatePath("/");
    revalidatePath(`/profile/${userId}`);
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
    revalidatePath("/");
    revalidatePath(`/profile/${userId}`);
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string; avatar: string }
) => {
  const { formData, cover, avatar } = payload;
  const fields = Object.fromEntries(formData);

  console.log("updateProfile called with:", { fields, cover, avatar }); // Debug log

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  const Profile = z.object({
    cover: z.string().optional(),
    avatar: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({ cover, avatar, ...filteredFields });

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const { userId } = auth();

  if (!userId) {
    console.log("No userId found");
    return { success: false, error: true };
  }

  try {
    // Ensure user exists before updating
    await ensureUserExists(userId);
    
    console.log("Updating user with data:", validatedFields.data); // Debug log
    
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    
    console.log("Profile updated successfully"); // Debug log
    
    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true, error: false };
  } catch (err) {
    console.log("Update profile error:", err);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    // Ensure user exists in database before creating like
    await ensureUserExists(userId);
    
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
    revalidatePath("/");
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    // Ensure user exists in database before creating comment
    await ensureUserExists(userId);
    
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get("desc") as string;

  const Desc = z.string().min(1).max(255);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log("description is not valid");
    return;
  }
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    // Ensure user exists in database before creating post
    await ensureUserExists(userId);
    
    await prisma.post.create({
      data: {
        desc: validatedDesc.data,
        userId,
        img,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    // Ensure user exists in database before creating story
    await ensureUserExists(userId);
    
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};

export const createStory = async (storyData: {
  text?: string;
  img?: string;
  video?: string;
  mediaType: "image" | "video" | "text";
  privacy: "public" | "friends" | "custom";
  customViewers?: string[];
  backgroundColor?: string;
  textColor?: string;
}) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    // Ensure user exists in database before creating story
    await ensureUserExists(userId);
    
    // Delete existing story (user can only have one active story)
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }

    const createData: any = {
      userId,
      mediaType: storyData.mediaType,
      privacy: storyData.privacy,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    if (storyData.text) createData.text = storyData.text;
    if (storyData.img) createData.img = storyData.img;
    if (storyData.video) createData.video = storyData.video;
    if (storyData.backgroundColor) createData.backgroundColor = storyData.backgroundColor;
    if (storyData.textColor) createData.textColor = storyData.textColor;
    if (storyData.customViewers) createData.customViewers = JSON.stringify(storyData.customViewers);

    const createdStory = await prisma.story.create({
      data: createData,
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/")
  } catch (err) {
    console.log(err);
  }
};

// Messaging Actions
export const sendMessage = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = auth();

  console.log("sendMessage called with userId:", userId); // Debug log

  if (!userId) {
    console.log("No userId found"); // Debug log
    return { success: false, error: true };
  }

  const content = formData.get("content") as string;
  const receiverId = formData.get("receiverId") as string;

  console.log("Message data:", { content, receiverId }); // Debug log

  if (!content || !receiverId) {
    console.log("Missing content or receiverId"); // Debug log
    return { success: false, error: true };
  }

  try {
    // Ensure both users exist
    await ensureUserExists(userId);
    await ensureUserExists(receiverId);

    // TODO: For now, allow messaging between any users
    // In production, you might want to check if users are mutual followers
    // const isMutualFollower = await prisma.user.findFirst({
    //   where: {
    //     id: userId,
    //     followings: {
    //       some: {
    //         followingId: receiverId,
    //       },
    //     },
    //     followers: {
    //       some: {
    //         followerId: receiverId,
    //       },
    //     },
    //   },
    // });

    // if (!isMutualFollower) {
    //   return { success: false, error: true };
    // }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: userId },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: userId,
          user2Id: receiverId,
        },
      });
    }

    // Create message
    await prisma.message.create({
      data: {
        content,
        senderId: userId,
        receiverId,
        conversationId: conversation.id,
      },
    });

    revalidatePath(`/messages/${receiverId}`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const markMessagesAsRead = async (conversationId: number) => {
  const { userId } = auth();

  if (!userId) return;

  try {
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
