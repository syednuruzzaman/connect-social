import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all non-dummy users (your real accounts)
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
    }
  });

  console.log('🔍 Found real users:');
  realUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.id} (@${user.username}) - ${user.name} ${user.surname}`);
  });

  // Get all dummy users
  const dummyUsers = await prisma.user.findMany({
    where: {
      id: {
        startsWith: 'user_dummy_'
      }
    },
    select: {
      id: true,
      username: true,
    }
  });

  console.log('\n👥 Creating mutual follow relationships...');

  // Create follow relationships for each real user with all dummy users
  for (const realUser of realUsers) {
    console.log(`\n📝 Adding friends for ${realUser.username}:`);
    
    for (const dummyUser of dummyUsers) {
      try {
        // Real user follows dummy user
        await prisma.follower.create({
          data: {
            followerId: realUser.id,
            followingId: dummyUser.id,
          },
        });
        
        // Dummy user follows real user back (mutual friendship)
        await prisma.follower.create({
          data: {
            followerId: dummyUser.id,
            followingId: realUser.id,
          },
        });
        
        console.log(`  ✅ Mutual follow with @${dummyUser.username}`);
      } catch (error) {
        // Skip if relationship already exists
        console.log(`  ⚠️ Relationship with @${dummyUser.username} already exists`);
      }
    }
  }

  console.log('\n🎉 Friend relationships created!');
  console.log(`✨ All real users now follow and are followed by all ${dummyUsers.length} dummy users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
