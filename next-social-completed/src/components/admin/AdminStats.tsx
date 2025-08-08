interface AdminStatsProps {
  totalUsers: number;
  totalPosts: number;
  totalFollows: number;
  totalLikes: number;
  totalComments: number;
  totalStories: number;
  totalRequests: number;
}

const AdminStats = ({
  totalUsers,
  totalPosts,
  totalFollows,
  totalLikes,
  totalComments,
  totalStories,
  totalRequests,
}: AdminStatsProps) => {
  const stats = [
    {
      name: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      name: "Total Posts",
      value: totalPosts,
      icon: "📝",
      color: "bg-green-500",
    },
    {
      name: "Follow Connections",
      value: totalFollows,
      icon: "🤝",
      color: "bg-purple-500",
    },
    {
      name: "Total Likes",
      value: totalLikes,
      icon: "❤️",
      color: "bg-red-500",
    },
    {
      name: "Total Comments",
      value: totalComments,
      icon: "💬",
      color: "bg-yellow-500",
    },
    {
      name: "Active Stories",
      value: totalStories,
      icon: "📚",
      color: "bg-indigo-500",
    },
    {
      name: "Pending Requests",
      value: totalRequests,
      icon: "📬",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full text-white text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
