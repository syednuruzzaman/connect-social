import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyUsers = [
  {
    id: "user_dummy_001",
    username: "alex_johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4",
    cover: "https://picsum.photos/800/300?random=1",
    name: "Alex",
    surname: "Johnson",
    description: "Software developer and coffee enthusiast ☕ Love coding and exploring new technologies!",
    city: "San Francisco",
    school: "Stanford University",
    work: "Google",
    website: "alexjohnson.dev",
    createdAt: new Date('2024-01-15'),
  },
  {
    id: "user_dummy_002",
    username: "sarah_williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=c084fc",
    cover: "https://picsum.photos/800/300?random=2",
    name: "Sarah",
    surname: "Williams",
    description: "Digital marketing strategist 📱 Helping brands grow online. Travel lover 🌍",
    city: "New York",
    school: "NYU",
    work: "Facebook",
    website: "sarahwilliams.com",
    createdAt: new Date('2024-02-10'),
  },
  {
    id: "user_dummy_003",
    username: "mike_chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike&backgroundColor=86efac",
    cover: "https://picsum.photos/800/300?random=3",
    name: "Mike",
    surname: "Chen",
    description: "UX Designer passionate about creating beautiful user experiences 🎨 Always learning!",
    city: "Seattle",
    school: "University of Washington",
    work: "Microsoft",
    website: "mikechen.design",
    createdAt: new Date('2024-01-20'),
  },
  {
    id: "user_dummy_004",
    username: "emma_davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=fbbf24",
    cover: "https://picsum.photos/800/300?random=4",
    name: "Emma",
    surname: "Davis",
    description: "Data scientist 📊 Turning data into insights. Love hiking and photography 📸",
    city: "Austin",
    school: "UT Austin",
    work: "Tesla",
    website: "emmadavis.ai",
    createdAt: new Date('2024-03-05'),
  },
  {
    id: "user_dummy_005",
    username: "david_martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=f87171",
    cover: "https://picsum.photos/800/300?random=5",
    name: "David",
    surname: "Martinez",
    description: "Full-stack developer 💻 Building the future one line of code at a time. Music lover 🎵",
    city: "Los Angeles",
    school: "UCLA",
    work: "Netflix",
    website: "davidmartinez.dev",
    createdAt: new Date('2024-02-28'),
  },
  {
    id: "user_dummy_006",
    username: "lisa_anderson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa&backgroundColor=a78bfa",
    cover: "https://picsum.photos/800/300?random=6",
    name: "Lisa",
    surname: "Anderson",
    description: "Product manager 🚀 Bridging the gap between tech and business. Yoga enthusiast 🧘‍♀️",
    city: "Chicago",
    school: "Northwestern",
    work: "Apple",
    website: "lisaanderson.pm",
    createdAt: new Date('2024-01-30'),
  },
  {
    id: "user_dummy_007",
    username: "james_wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=fb923c",
    cover: "https://picsum.photos/800/300?random=7",
    name: "James",
    surname: "Wilson",
    description: "Cybersecurity expert 🔒 Protecting digital assets. Rock climbing adventurer 🧗‍♂️",
    city: "Denver",
    school: "Colorado State",
    work: "CrowdStrike",
    website: "jameswilson.security",
    createdAt: new Date('2024-02-15'),
  },
  {
    id: "user_dummy_008",
    username: "sophia_taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=34d399",
    cover: "https://picsum.photos/800/300?random=8",
    name: "Sophia",
    surname: "Taylor",
    description: "AI researcher 🤖 Working on the next generation of machine learning. Cat lover 🐱",
    city: "Boston",
    school: "MIT",
    work: "OpenAI",
    website: "sophiataylor.ai",
    createdAt: new Date('2024-03-10'),
  }
];

const dummyPosts = [
  {
    desc: "Just finished building an amazing new feature! 🚀 Love when code works on the first try 😄",
    userId: "user_dummy_001",
    img: "https://picsum.photos/400/300?random=101",
    createdAt: new Date('2024-04-01'),
  },
  {
    desc: "Beautiful sunset from my office window today 🌅 Sometimes remote work has its perks!",
    userId: "user_dummy_002",
    img: "https://picsum.photos/400/300?random=102",
    createdAt: new Date('2024-04-02'),
  },
  {
    desc: "Working on some exciting design mockups. Can't wait to share the final product! 🎨",
    userId: "user_dummy_003",
    img: "https://picsum.photos/400/300?random=103",
    createdAt: new Date('2024-04-03'),
  },
  {
    desc: "The data is telling an interesting story today 📊 Love discovering new patterns!",
    userId: "user_dummy_004",
    img: "https://picsum.photos/400/300?random=104",
    createdAt: new Date('2024-04-04'),
  },
  {
    desc: "Coffee and code - the perfect combination ☕💻 #DeveloperLife",
    userId: "user_dummy_005",
    img: "https://picsum.photos/400/300?random=105",
    createdAt: new Date('2024-04-05'),
  },
  {
    desc: "Great team meeting today! Love collaborating with such talented people 👥",
    userId: "user_dummy_006",
    createdAt: new Date('2024-04-06'),
  },
  {
    desc: "Hiking trail this weekend was absolutely stunning! 🏔️ Nature is the best stress reliever",
    userId: "user_dummy_007",
    img: "https://picsum.photos/400/300?random=107",
    createdAt: new Date('2024-04-07'),
  },
  {
    desc: "Excited about the latest AI developments! The future is looking bright 🤖✨",
    userId: "user_dummy_008",
    createdAt: new Date('2024-04-08'),
  },
];

const followRelationships = [
  // Alex follows Sarah, Mike, Emma
  { followerId: "user_dummy_001", followingId: "user_dummy_002" },
  { followerId: "user_dummy_001", followingId: "user_dummy_003" },
  { followerId: "user_dummy_001", followingId: "user_dummy_004" },
  
  // Sarah follows Alex, David, Lisa
  { followerId: "user_dummy_002", followingId: "user_dummy_001" },
  { followerId: "user_dummy_002", followingId: "user_dummy_005" },
  { followerId: "user_dummy_002", followingId: "user_dummy_006" },
  
  // Mike follows Alex, Emma, James
  { followerId: "user_dummy_003", followingId: "user_dummy_001" },
  { followerId: "user_dummy_003", followingId: "user_dummy_004" },
  { followerId: "user_dummy_003", followingId: "user_dummy_007" },
  
  // Emma follows Sarah, Mike, Sophia
  { followerId: "user_dummy_004", followingId: "user_dummy_002" },
  { followerId: "user_dummy_004", followingId: "user_dummy_003" },
  { followerId: "user_dummy_004", followingId: "user_dummy_008" },
  
  // David follows Lisa, James, Alex
  { followerId: "user_dummy_005", followingId: "user_dummy_006" },
  { followerId: "user_dummy_005", followingId: "user_dummy_007" },
  { followerId: "user_dummy_005", followingId: "user_dummy_001" },
  
  // Lisa follows David, Emma, Sophia
  { followerId: "user_dummy_006", followingId: "user_dummy_005" },
  { followerId: "user_dummy_006", followingId: "user_dummy_004" },
  { followerId: "user_dummy_006", followingId: "user_dummy_008" },
];

async function main() {
  console.log('🌱 Seeding dummy users...');

  // Create users
  for (const user of dummyUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
    console.log(`✅ Created user: ${user.username}`);
  }

  // Create posts
  for (const post of dummyPosts) {
    await prisma.post.create({
      data: post,
    });
    console.log(`✅ Created post by: ${post.userId}`);
  }

  // Create follow relationships
  for (const follow of followRelationships) {
    await prisma.follower.create({
      data: follow,
    });
  }
  console.log('✅ Created follow relationships');

  // Add some likes to posts
  const posts = await prisma.post.findMany();
  const users = await prisma.user.findMany();
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    // Add 2-5 random likes per post
    const numLikes = Math.floor(Math.random() * 4) + 2;
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < Math.min(numLikes, shuffledUsers.length); j++) {
      try {
        await prisma.like.create({
          data: {
            userId: shuffledUsers[j].id,
            postId: post.id,
          },
        });
      } catch (error) {
        // Skip if like already exists
      }
    }
  }
  console.log('✅ Added likes to posts');

  // Add some comments
  const comments = [
    "Great post! 👏",
    "Love this! 😍",
    "Amazing work! 🔥",
    "So inspiring! ✨",
    "This is awesome! 🚀",
    "Keep it up! 💪",
    "Beautiful! 😊",
    "Incredible! 👌",
  ];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const numComments = Math.floor(Math.random() * 3) + 1;
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < Math.min(numComments, shuffledUsers.length); j++) {
      await prisma.comment.create({
        data: {
          desc: comments[Math.floor(Math.random() * comments.length)],
          userId: shuffledUsers[j].id,
          postId: post.id,
          createdAt: new Date(Date.now() + j * 1000 * 60 * 10), // 10 minutes apart
        },
      });
    }
  }
  console.log('✅ Added comments to posts');

  console.log('🎉 Dummy data seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- ${dummyUsers.length} users created`);
  console.log(`- ${dummyPosts.length} posts created`);
  console.log(`- ${followRelationships.length} follow relationships created`);
  console.log('- Random likes and comments added');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
