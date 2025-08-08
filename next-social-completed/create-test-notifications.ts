import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestNotifications() {
  console.log('🔔 Creating test notifications...');

  // Get all users
  const users = await prisma.user.findMany();
  
  if (users.length < 2) {
    console.log('❌ Need at least 2 users to create test notifications');
    return;
  }

  const [user1, user2] = users;

  // Get user1's posts
  const user1Posts = await prisma.post.findMany({
    where: { userId: user1.id },
    take: 2
  });

  if (user1Posts.length > 0) {
    // Create some likes on user1's posts from user2
    for (const post of user1Posts) {
      try {
        await prisma.like.create({
          data: {
            userId: user2.id,
            postId: post.id,
          },
        });
        console.log(`✅ Created like from ${user2.username} on ${user1.username}'s post`);
      } catch (error) {
        console.log(`⚠️ Like might already exist: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Create some comments on user1's posts from user2
    for (const post of user1Posts.slice(0, 1)) {
      try {
        await prisma.comment.create({
          data: {
            desc: `Great post! 👍 - from ${user2.username}`,
            userId: user2.id,
            postId: post.id,
          },
        });
        console.log(`✅ Created comment from ${user2.username} on ${user1.username}'s post`);
      } catch (error) {
        console.log(`⚠️ Error creating comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  console.log('🎉 Test notifications created!');
}

createTestNotifications()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
