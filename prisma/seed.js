const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding simplified...');
    try {
        const user = await prisma.user.findFirst();
        console.log('Connection successful. Found user:', user ? user.email : 'none');

        // Create a single test user
        const testUser = await prisma.user.upsert({
            where: { email: 'test-seed@example.com' },
            update: {},
            create: {
                email: 'test-seed@example.com',
                name: 'Seed Test',
                role: 'TENANT',
            }
        });
        console.log('Created/Updated test user:', testUser.email);
    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
