import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/client";
import Post from "@/components/feed/Post";
import Comments from "@/components/feed/Comments";
import Link from "next/link";

const PostPage = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const postId = parseInt(params.id);

  if (isNaN(postId)) {
    redirect("/");
  }

  // Fetch the specific post
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          name: true,
          surname: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post) {
    redirect("/");
  }

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        {/* Left sidebar - could add related content or navigation */}
      </div>
      
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          {/* Back button */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>

          {/* Post */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Post post={{
              ...post,
              likes: post.likes as [{ userId: string }]
            }} />
          </div>

          {/* Comments */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Suspense fallback="Loading comments...">
              <Comments postId={postId} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[30%]">
        {/* Right sidebar - could add suggested posts or user info */}
      </div>
    </div>
  );
};

export default PostPage;
