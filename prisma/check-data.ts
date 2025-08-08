import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const posts = await prisma.post.count();
  const follows = await prisma.follower.count();
  const requests = await prisma.followRequest.count();
  const stories = await prisma.story.count();
  const likes = await prisma.like.count();
  const comments = await prisma.comment.count();

  console.log('📊 Database Summary:');
  console.log(`👥 Users: ${users}`);
  console.log(`📝 Posts: ${posts}`);
  console.log(`🤝 Follows: ${follows}`);
  console.log(`📬 Friend Requests: ${requests}`);
  console.log(`📚 Stories: ${stories}`);
  console.log(`❤️ Likes: ${likes}`);
  console.log(`💬 Comments: ${comments}`);

  // Show some user details
  console.log('\n👤 Sample Users:');
  const sampleUsers = await prisma.user.findMany({
    take: 3,
    select: {
      username: true,
      name: true,
      surname: true,
      city: true,
      work: true,
    },
  });

  sampleUsers.forEach(user => {
    console.log(`- ${user.username} (${user.name} ${user.surname}) - ${user.work} in ${user.city}`);
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
