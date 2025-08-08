import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const friendRequests = [
  // Pending friend requests
  { senderId: "user_dummy_007", receiverId: "user_dummy_002" }, // James -> Sarah
  { senderId: "user_dummy_008", receiverId: "user_dummy_001" }, // Sophia -> Alex
  { senderId: "user_dummy_004", receiverId: "user_dummy_005" }, // Emma -> David
  { senderId: "user_dummy_003", receiverId: "user_dummy_006" }, // Mike -> Lisa
];

async function main() {
  console.log('🤝 Creating friend requests...');

  for (const request of friendRequests) {
    await prisma.followRequest.create({
      data: request,
    });
    console.log(`✅ Created friend request: ${request.senderId} -> ${request.receiverId}`);
  }

  console.log('🎉 Friend requests created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
