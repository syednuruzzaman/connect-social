
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import ProfileHeader from "@/components/ProfileHeader";
import FloatingCloseButton from "@/components/FloatingCloseButton";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const username = params.username;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const { userId: currentUserId } = auth();

  let isBlocked;

  if (currentUserId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });

    if (res) isBlocked = true;
  } else {
    isBlocked = false;
  }

  if (isBlocked) return notFound();

  return (
    <>
      {/* Floating Close Button - Always visible */}
      <FloatingCloseButton />
      
      <div className="profile-container flex gap-6 pt-4 pb-4 h-full">
        {/* Desktop Left Sidebar */}
        <div className="hidden xl:block w-[20%] h-fit sticky top-4">
          <LeftMenu type="profile" />
        </div>
        
        {/* Main Content */}
        <div className="w-full lg:w-[70%] xl:w-[50%] profile-content">
          <div className="flex flex-col gap-4 h-full">
            {/* Fixed Header with Back Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10">
              <ProfileHeader 
                userDisplayName={
                  user.name && user.surname
                    ? `${user.name} ${user.surname}`
                    : user.username
                }
              />
            </div>
            
            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Profile Info Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full h-48 sm:h-64 relative mb-4">
                    <Image
                      src={user.cover || "/noCover.png"}
                      alt="Cover Image"
                      fill
                      className="rounded-md object-cover"
                    />
                    <Image
                      src={user.avatar || "/noAvatar.png"}
                      alt="Profile Image"
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full absolute left-0 right-0 m-auto -bottom-10 sm:-bottom-12 ring-4 ring-white object-cover"
                    />
                  </div>
                  
                  <div className="mt-12 sm:mt-16 text-center">
                    <h1 className="text-xl sm:text-2xl font-medium mb-4">
                      {user.name && user.surname
                        ? `${user.name} ${user.surname}`
                        : user.username}
                    </h1>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 sm:gap-12 mb-4">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-lg">{user._count.posts}</span>
                        <span className="text-sm text-gray-500">Posts</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-lg">{user._count.followers}</span>
                        <span className="text-sm text-gray-500">Followers</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-lg">{user._count.followings}</span>
                        <span className="text-sm text-gray-500">Following</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Posts Feed - Contained within scrollable area */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Posts</h2>
                <div className="feed-container">
                  <Feed username={user.username}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Right Sidebar */}
        <div className="hidden lg:block w-[30%] h-fit sticky top-4">
          <RightMenu user={user as any} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
