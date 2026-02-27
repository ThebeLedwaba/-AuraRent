const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
    const email = 'admin@aurarent.com';
    const plainPassword = 'password123';

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log('User NOT found');
        return;
    }

    console.log('User found. Password hash in DB:', user.password);

    const isValid = await bcrypt.compare(plainPassword, user.password);
    console.log('Is password valid (using bcryptjs):', isValid);

    // Also try with bcrypt (if available) to see if there's a mismatch
    try {
        const bcryptNative = require('bcrypt');
        const isValidNative = await bcryptNative.compare(plainPassword, user.password);
        console.log('Is password valid (using native bcrypt):', isValidNative);
    } catch (e) {
        console.log('Native bcrypt not installed.');
    }
}

verify().catch(console.error).finally(() => prisma.$disconnect());
