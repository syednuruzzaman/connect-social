import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import UpdateUser from "@/components/rightMenu/UpdateUser";

const SettingsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
          
          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Information</h2>
            
            {/* Current Profile Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={user.avatar || "/noAvatar.png"}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
                  </h3>
                  <p className="text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-400">
                    {user._count.posts} posts • {user._count.followers} followers • {user._count.followings} following
                  </p>
                </div>
              </div>
              
              {user.description && (
                <p className="text-gray-600 text-sm mb-2">{user.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {user.city && <div><strong>City:</strong> {user.city}</div>}
                {user.school && <div><strong>School:</strong> {user.school}</div>}
                {user.work && <div><strong>Work:</strong> {user.work}</div>}
                {user.website && <div><strong>Website:</strong> {user.website}</div>}
              </div>
            </div>

            {/* Update Profile Form */}
            <UpdateUser user={user} />
          </div>

          {/* Account Actions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Profile Picture & Username:</strong> To change your profile picture or username, 
                  click on your avatar in the top navigation bar and use Clerk's user management.
                </p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  🔐 <strong>Password & Security:</strong> Manage your password and security settings 
                  through Clerk's account management in the navigation bar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3 text-sm">
            <a href="/profile/me" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Image src="/people.png" alt="" width={16} height={16} />
              View My Profile
            </a>
            <a href="/messages" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Image src="/messages.png" alt="" width={16} height={16} />
              Messages
            </a>
            <a href="/" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Image src="/home.png" alt="" width={16} height={16} />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;