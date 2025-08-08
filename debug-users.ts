import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugUsers() {
  console.log('🔍 Debugging User Data...\n');

  // Get all users from database
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      avatar: true,
      name: true,
      surname: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`📊 Total users in database: ${users.length}\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. User ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Name: ${user.name} ${user.surname}`);
    console.log(`   Avatar: ${user.avatar}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log('   ---');
  });

  // Check for duplicate usernames or names
  const usernames = users.map(u => u.username);
  const duplicateUsernames = usernames.filter((item, index) => usernames.indexOf(item) !== index);
  
  if (duplicateUsernames.length > 0) {
    console.log('⚠️  Duplicate usernames found:', duplicateUsernames);
  }

  await prisma.$disconnect();
}

debugUsers()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
