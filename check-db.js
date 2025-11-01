const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkNotices() {
  try {
    const notices = await prisma.notice.findMany({
      take: 5
    });
    
    console.log(`Found ${notices.length} notices in database:`);
    console.log(notices);
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotices();