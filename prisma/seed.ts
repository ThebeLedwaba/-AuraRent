import { PrismaClient, UserRole, PropertyStatus, BookingStatus, NotificationType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database with expanded mock data...');

    // 1. Clean data (Order matters for foreign keys)
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@aurarent.com',
            password: hashedPassword,
            role: UserRole.ADMIN,
            isVerified: true,
            image: 'https://i.pravatar.cc/150?u=admin',
        },
    });

    const landlord1 = await prisma.user.create({
        data: {
            name: 'John Landlord',
            email: 'john@example.com',
            password: hashedPassword,
            role: UserRole.LANDLORD,
            isVerified: true,
            image: 'https://i.pravatar.cc/150?u=john',
        },
    });

    const landlord2 = await prisma.user.create({
        data: {
            name: 'Sarah Owner',
            email: 'sarah@example.com',
            password: hashedPassword,
            role: UserRole.LANDLORD,
            isVerified: true,
            image: 'https://i.pravatar.cc/150?u=sarah',
        },
    });

    const tenant1 = await prisma.user.create({
        data: {
            name: 'Jane Tenant',
            email: 'jane@example.com',
            password: hashedPassword,
            role: UserRole.TENANT,
            isVerified: true,
            image: 'https://i.pravatar.cc/150?u=jane',
        },
    });

    const tenant2 = await prisma.user.create({
        data: {
            name: 'Mike Renter',
            email: 'mike@example.com',
            password: hashedPassword,
            role: UserRole.TENANT,
            isVerified: true,
            image: 'https://i.pravatar.cc/150?u=mike',
        },
    });

    console.log('Users created.');

    // 3. Create Properties
    const prop1 = await prisma.property.create({
        data: {
            title: 'Modern Downtown Loft',
            description: 'A beautiful loft in the heart of the city. High ceilings and industrial feel.',
            price: 150,
            address: '123 Main St',
            city: 'New York',
            type: 'APARTMENT',
            bedrooms: 1,
            bathrooms: 1,
            area: 85,
            amenities: ['WiFi', 'Kitchen', 'AC', 'Elevator', 'Gym'],
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'
            ],
            ownerId: landlord1.id,
            status: PropertyStatus.AVAILABLE,
        },
    });

    const prop2 = await prisma.property.create({
        data: {
            title: 'Serene Garden Villa',
            description: 'Quiet villa with a private garden. Perfect for families looking for peace and quiet.',
            price: 320,
            address: '45 Orchard Rd',
            city: 'Los Angeles',
            type: 'HOUSE',
            bedrooms: 3,
            bathrooms: 2,
            area: 210,
            amenities: ['Pool', 'Garden', 'Garage', 'WiFi', 'BBQ'],
            images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000'
            ],
            ownerId: landlord1.id,
            status: PropertyStatus.AVAILABLE,
        },
    });

    const prop3 = await prisma.property.create({
        data: {
            title: 'Cozy Beachfront Studio',
            description: 'Wake up to the sound of waves. Small but elegant studio right on the beach.',
            price: 120,
            address: '7 Sunset Blvd',
            city: 'Miami',
            type: 'STUDIO',
            bedrooms: 1,
            bathrooms: 1,
            area: 45,
            amenities: ['Beach Access', 'Kitchen', 'Balcony', 'WiFi'],
            images: [
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000'
            ],
            ownerId: landlord2.id,
            status: PropertyStatus.AVAILABLE,
        },
    });

    const prop4 = await prisma.property.create({
        data: {
            title: 'Luxury Penthouse',
            description: 'Panoramic city views from the top floor. Ultimate luxury living.',
            price: 550,
            address: '99 Sky Tower',
            city: 'Chicago',
            type: 'APARTMENT',
            bedrooms: 4,
            bathrooms: 3.5,
            area: 350,
            amenities: ['Private Elevator', 'Wine Cellar', 'Smart Home', '24/7 Security'],
            images: [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000'
            ],
            ownerId: landlord2.id,
            status: PropertyStatus.AVAILABLE,
        },
    });

    console.log('Properties created.');

    // 4. Create Bookings (Variety of statuses)
    const booking1 = await prisma.booking.create({
        data: {
            userId: tenant1.id,
            propertyId: prop1.id,
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-03-05'),
            totalPrice: 600,
            status: BookingStatus.PAID,
        },
    });

    const booking2 = await prisma.booking.create({
        data: {
            userId: tenant1.id,
            propertyId: prop2.id,
            startDate: new Date('2026-04-10'),
            endDate: new Date('2026-04-15'),
            totalPrice: 1600,
            status: BookingStatus.CONFIRMED,
        },
    });

    const booking3 = await prisma.booking.create({
        data: {
            userId: tenant2.id,
            propertyId: prop3.id,
            startDate: new Date('2026-03-20'),
            endDate: new Date('2026-03-22'),
            totalPrice: 240,
            status: BookingStatus.PENDING,
        },
    });

    const booking4 = await prisma.booking.create({
        data: {
            userId: tenant2.id,
            propertyId: prop4.id,
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-05-07'),
            totalPrice: 3300,
            status: BookingStatus.CANCELLED,
        },
    });

    console.log('Bookings created.');

    // 5. Create Reviews
    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Absolutely loved this loft! The view is incredible and it was very clean.',
            reviewerId: tenant1.id,
            propertyId: prop1.id,
        },
    });

    await prisma.review.create({
        data: {
            rating: 4,
            comment: 'Great villa, kids loved the garden. Minor issue with the pool heater but host was responsive.',
            reviewerId: tenant2.id,
            propertyId: prop2.id,
        },
    });

    console.log('Reviews created.');

    // 6. Create Conversations and Messages
    const conv1 = await prisma.conversation.create({
        data: {
            propertyId: prop1.id,
            participants: {
                connect: [{ id: landlord1.id }, { id: tenant1.id }]
            }
        }
    });

    await prisma.message.createMany({
        data: [
            {
                text: 'Hi John, is the loft available for early check-in?',
                senderId: tenant1.id,
                conversationId: conv1.id,
            },
            {
                text: 'Yes Jane, you can check in as early as 10 AM.',
                senderId: landlord1.id,
                conversationId: conv1.id,
            },
            {
                text: 'Perfect, thank you!',
                senderId: tenant1.id,
                conversationId: conv1.id,
            }
        ]
    });

    console.log('Conversations and messages created.');

    // 7. Create Notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: tenant1.id,
                type: NotificationType.BOOKING_CONFIRMED,
                message: 'Your stay at Modern Downtown Loft is confirmed!',
                link: '/dashboard/tenant',
            },
            {
                userId: landlord1.id,
                type: NotificationType.BOOKING_REQUEST,
                message: 'New booking request for Serene Garden Villa from Mike Renter.',
                link: '/dashboard/landlord',
            },
            {
                userId: tenant2.id,
                type: NotificationType.NEW_MESSAGE,
                message: 'John Landlord sent you a message.',
                link: '/dashboard/messages',
            }
        ]
    });

    console.log('Notifications created.');
    console.log('Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
