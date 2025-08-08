import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestPostsWithMedia() {
  // Add some posts with images for testing
  const users = await prisma.user.findMany();
  
  if (users.length > 0) {
    const user = users[0]; // Use the first user
    
    // Create posts with sample images
    await prisma.post.createMany({
      data: [
        {
          desc: 'Beautiful sunset photo!',
          userId: user.id,
          img: 'https://picsum.photos/400/300?random=301',
        },
        {
          desc: 'Mountain hiking adventure',
          userId: user.id,
          img: 'https://picsum.photos/400/300?random=302',
        },
        {
          desc: 'City skyline at night',
          userId: user.id,
          img: 'https://picsum.photos/400/300?random=303',
        },
        {
          desc: 'Beach vacation vibes',
          userId: user.id,
          img: 'https://picsum.photos/400/300?random=304',
        },
      ],
    });
    
    console.log('Added test posts with media for user:', user.username);
  } else {
    console.log('No users found. Create a user first.');
  }
}

addTestPostsWithMedia()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
