import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const GroupsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Sample groups data - in a real app, this would come from database
  const sampleGroups = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      description: "Discuss the latest in technology and innovation",
      members: 1247,
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
      isJoined: true,
    },
    {
      id: 2,
      name: "Photography Lovers",
      description: "Share and discuss beautiful photography",
      members: 892,
      image: "https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&w=400",
      isJoined: false,
    },
    {
      id: 3,
      name: "Travel Adventures",
      description: "Share your travel experiences and get advice",
      members: 2156,
      image: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400",
      isJoined: true,
    },
  ];

  return (
    <div className="flex gap-6 pt-6">
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              Create Group
            </button>
          </div>

          {/* Groups Grid */}
          <div className="space-y-4">
            {sampleGroups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4">
                  <Image
                    src={group.image}
                    alt={group.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {group.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {group.description}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {group.members.toLocaleString()} members
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {group.isJoined ? (
                          <>
                            <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                              Joined
                            </button>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                              Leave
                            </button>
                          </>
                        ) : (
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Join Group
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <div className="mb-4">
              <Image
                src="/groups.png"
                alt="Groups"
                width={48}
                height={48}
                className="mx-auto opacity-60"
              />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">🚧 Groups Feature Coming Soon!</h3>
            <p className="text-blue-700 text-sm mb-4">
              We're working hard to bring you the full groups experience with:
            </p>
            <ul className="text-blue-600 text-sm space-y-1 max-w-md mx-auto">
              <li>• Create and manage your own groups</li>
              <li>• Join existing communities</li>
              <li>• Group discussions and posts</li>
              <li>• Event planning within groups</li>
              <li>• Private group messaging</li>
            </ul>
            <p className="text-blue-500 text-xs mt-4">
              Stay tuned for updates! In the meantime, connect with people through direct messages.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-[30%]">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3 text-sm">
            <button className="w-full flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded">
              <Image src="/addevent.png" alt="" width={16} height={16} />
              Create Group
            </button>
            <Link href="/messages" className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded">
              <Image src="/messages.png" alt="" width={16} height={16} />
              Messages
            </Link>
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded">
              <Image src="/home.png" alt="" width={16} height={16} />
              Back to Home
            </Link>
          </div>

          <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 text-sm mb-2">💡 Tips</h4>
            <ul className="text-yellow-700 text-xs space-y-1">
              <li>• Groups help you connect with like-minded people</li>
              <li>• Create groups around your interests</li>
              <li>• Use messages to chat with friends directly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
