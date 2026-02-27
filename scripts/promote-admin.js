const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteToAdmin(email) {
    if (!email) {
        console.error('Please provide an email address.');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        });
        console.log(`Successfully promoted ${user.email} to ADMIN.`);
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
promoteToAdmin(email);
