const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create a sample Landlord
    const landlord = await prisma.user.upsert({
        where: { email: "landlord@example.com" },
        update: {},
        create: {
            email: "landlord@example.com",
            name: "John Landlord",
            password: hashedPassword,
            role: "LANDLORD",
        },
    });

    // Create sample properties
    const properties = [
        {
            title: "Modern Glass Villa",
            description: "A stunning modern villa with floor-to-ceiling windows and panoramic city views.",
            price: 4500.0,
            address: "123 luxury Way",
            city: "Los Angeles",
            type: "VILLA",
            bedrooms: 4,
            bathrooms: 3,
            amenities: ["Pool", "Gym", "Smart Home"],
            images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1471"],
            ownerId: landlord.id,
        },
        {
            title: "Urban Industrial Studio",
            description: "Sleek industrial design meets comfort in the heart of the downtown arts district.",
            price: 1850.0,
            address: "456 Loft St",
            city: "New York",
            type: "STUDIO",
            bedrooms: 1,
            bathrooms: 1,
            amenities: ["High Ceilings", "Exposed Brick"],
            images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1380"],
            ownerId: landlord.id,
        },
        {
            title: "Emerald Garden Apartment",
            description: "Quiet and spacious apartment surrounded by lush greenery and private gardens.",
            price: 2200.0,
            address: "789 Park Lane",
            city: "London",
            type: "APARTMENT",
            bedrooms: 2,
            bathrooms: 2,
            amenities: ["Garden", "Parking"],
            images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1470"],
            ownerId: landlord.id,
        },
    ];

    for (const p of properties) {
        await prisma.property.create({
            data: p,
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
