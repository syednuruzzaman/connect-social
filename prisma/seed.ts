import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test users (these would normally come from Clerk)
  const user1 = await prisma.user.upsert({
    where: { username: 'testuser1' },
    update: {},
    create: {
      id: 'user_test_123',
      username: 'testuser1',
      name: 'John',
      surname: 'Doe',
      avatar: '/noAvatar.png',
      cover: '/noCover.png',
      description: 'Hello, I am John!',
      city: 'New York',
      school: 'Test University',
      work: 'Software Developer',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { username: 'testuser2' },
    update: {},
    create: {
      id: 'user_test_456',
      username: 'testuser2',
      name: 'Jane',
      surname: 'Smith',
      avatar: '/noAvatar.png',
      cover: '/noCover.png',
      description: 'Hello, I am Jane!',
      city: 'Los Angeles',
      school: 'Another University',
      work: 'Designer',
    },
  })

  // Create test posts
  const post1 = await prisma.post.create({
    data: {
      desc: 'This is my first post! Welcome to our social media app.',
      userId: user1.id,
      img: null,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      desc: 'Beautiful day today! Sharing some thoughts.',
      userId: user2.id,
      img: null,
    },
  })

  // Create test comments
  await prisma.comment.create({
    data: {
      desc: 'Great post!',
      userId: user2.id,
      postId: post1.id,
    },
  })

  // Create test likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
