import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stories = [
  {
    img: "https://picsum.photos/400/600?random=201",
    userId: "user_dummy_001", // Alex
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    img: "https://picsum.photos/400/600?random=202",
    userId: "user_dummy_002", // Sarah
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    img: "https://picsum.photos/400/600?random=203",
    userId: "user_dummy_003", // Mike
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    img: "https://picsum.photos/400/600?random=204",
    userId: "user_dummy_004", // Emma
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    img: "https://picsum.photos/400/600?random=205",
    userId: "user_dummy_005", // David
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    img: "https://picsum.photos/400/600?random=206",
    userId: "user_dummy_006", // Lisa
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
];

async function main() {
  console.log('📚 Creating stories...');

  for (const story of stories) {
    await prisma.story.create({
      data: story,
    });
    console.log(`✅ Created story for user: ${story.userId}`);
  }

  console.log('🎉 Stories created!');
  console.log(`📊 Created ${stories.length} stories that expire in 24 hours`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
