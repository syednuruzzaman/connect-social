import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('❤️ Adding likes and interactions...');

  // Get all real users (your accounts)
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
    }
  });

  // Get all posts from dummy users
  const dummyPosts = await prisma.post.findMany({
    where: {
      userId: {
        startsWith: 'user_dummy_'
      }
    },
    select: {
      id: true,
      userId: true,
      desc: true,
    }
  });

  console.log(`📝 Found ${dummyPosts.length} posts from dummy users`);

  // Add likes from real users to dummy posts
  for (const realUser of realUsers) {
    console.log(`\n💝 Adding likes from @${realUser.username}:`);
    
    // Like 60-80% of dummy posts randomly
    const postsToLike = dummyPosts.sort(() => 0.5 - Math.random()).slice(0, Math.floor(dummyPosts.length * 0.7));
    
    for (const post of postsToLike) {
      try {
        await prisma.like.create({
          data: {
            userId: realUser.id,
            postId: post.id,
          },
        });
        console.log(`  ❤️ Liked: "${post.desc.substring(0, 50)}..."`);
      } catch (error) {
        // Skip if like already exists
      }
    }
  }

  // Add some comments from real users to dummy posts
  const encouragingComments = [
    "This is amazing! 🔥",
    "Love this post! 😍",
    "So inspiring! ✨",
    "Great work! 👏",
    "Absolutely beautiful! 😊",
    "Keep it up! 💪",
    "This made my day! 🌟",
    "Incredible! 🚀",
    "So cool! 😎",
    "Love the energy! ⚡",
  ];

  console.log('\n💬 Adding comments from real users:');
  
  for (const realUser of realUsers) {
    // Comment on 3-4 random posts
    const postsToComment = dummyPosts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    for (const post of postsToComment) {
      const randomComment = encouragingComments[Math.floor(Math.random() * encouragingComments.length)];
      
      try {
        await prisma.comment.create({
          data: {
            desc: randomComment,
            userId: realUser.id,
            postId: post.id,
            createdAt: new Date(),
          },
        });
        console.log(`  💬 @${realUser.username} commented: "${randomComment}"`);
      } catch (error) {
        // Skip if comment creation fails
      }
    }
  }

  console.log('\n🎉 Interactions added successfully!');
  console.log('✨ Your accounts now have likes and comments on dummy users\' posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
