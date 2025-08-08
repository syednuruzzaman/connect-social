import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌐 CONNECT SOCIAL NETWORK SUMMARY');
  console.log('================================\n');

  // Get your user accounts with follower counts
  const realUsers = await prisma.user.findMany({
    where: {
      id: {
        not: {
          startsWith: 'user_dummy_'
        }
      }
    },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
          likes: true,
          comments: true,
        }
      }
    }
  });

  console.log('👤 YOUR ACCOUNTS:');
  console.log('================');
  realUsers.forEach((user, index) => {
    console.log(`${index + 1}. @${user.username} (${user.name} ${user.surname})`);
    console.log(`   📊 ${user._count.followers} followers, ${user._count.followings} following`);
    console.log(`   📝 ${user._count.posts} posts, ${user._count.likes} likes given, ${user._count.comments} comments made`);
    console.log(`   🔗 Profile: http://localhost:3001/profile/${user.username}`);
    console.log('');
  });

  // Get dummy users summary
  const dummyUsersCount = await prisma.user.count({
    where: {
      id: {
        startsWith: 'user_dummy_'
      }
    }
  });

  const totalStats = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.follower.count(),
    prisma.like.count(),
    prisma.comment.count(),
    prisma.story.count(),
    prisma.followRequest.count(),
  ]);

  const [totalUsers, totalPosts, totalFollows, totalLikes, totalComments, totalStories, totalRequests] = totalStats;

  console.log('📊 NETWORK STATISTICS:');
  console.log('======================');
  console.log(`👥 Total Users: ${totalUsers} (${realUsers.length} real + ${dummyUsersCount} dummy)`);
  console.log(`📝 Total Posts: ${totalPosts}`);
  console.log(`🤝 Total Follows: ${totalFollows}`);
  console.log(`❤️ Total Likes: ${totalLikes}`);
  console.log(`💬 Total Comments: ${totalComments}`);
  console.log(`📚 Active Stories: ${totalStories}`);
  console.log(`📬 Pending Requests: ${totalRequests}`);

  console.log('\n🎯 WHAT YOU CAN DO NOW:');
  console.log('=======================');
  console.log('✅ View posts from all 8 dummy users in your feed');
  console.log('✅ Like and comment on dummy users\' posts');
  console.log('✅ Visit dummy user profiles and see their content');
  console.log('✅ See dummy users in your friends/following list');
  console.log('✅ View stories from dummy users');
  console.log('✅ Test all social features with realistic data');

  console.log('\n🚀 QUICK LINKS:');
  console.log('===============');
  console.log('🏠 Home Feed: http://localhost:3001');
  console.log('⚙️ Settings: http://localhost:3001/settings');
  
  const dummyUsers = await prisma.user.findMany({
    where: {
      id: {
        startsWith: 'user_dummy_'
      }
    },
    select: {
      username: true,
    },
    take: 3
  });

  console.log('\n🔗 Sample Dummy Profiles:');
  dummyUsers.forEach(user => {
    console.log(`   http://localhost:3001/profile/${user.username}`);
  });

  console.log('\n🎉 Your Connect social network is now fully populated and ready for testing!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
