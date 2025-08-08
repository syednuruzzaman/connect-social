import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎭 DUMMY USERS FOR TESTING');
  console.log('==========================\n');

  const dummyUsers = await prisma.user.findMany({
    where: {
      id: {
        startsWith: 'user_dummy_'
      }
    },
    select: {
      username: true,
      name: true,
      surname: true,
      description: true,
      city: true,
      work: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true
        }
      }
    },
    orderBy: {
      username: 'asc'
    }
  });

  dummyUsers.forEach((user, index) => {
    console.log(`${index + 1}. @${user.username}`);
    console.log(`   Name: ${user.name} ${user.surname}`);
    console.log(`   Bio: ${user.description}`);
    console.log(`   Location: ${user.work} in ${user.city}`);
    console.log(`   Stats: ${user._count.posts} posts, ${user._count.followers} followers, ${user._count.followings} following`);
    console.log(`   Profile URL: http://localhost:3000/profile/${user.username}`);
    console.log('');
  });

  console.log('🔗 Quick Links for Testing:');
  console.log('============================');
  dummyUsers.forEach(user => {
    console.log(`• http://localhost:3000/profile/${user.username}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
