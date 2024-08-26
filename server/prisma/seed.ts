import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            {
                name: 'Mentor One',
                email: 'mentor1@example.com',
                role: 'MENTOR',
                password: 'defaultpassword',
            },
            {
                name: 'Mentor Two',
                email: 'mentor2@example.com',
                role: 'MENTOR',
                password: 'defaultpassword',
            },
            {
                name: 'Student One',
                email: 'student1@example.com',
                role: 'STUDENT',
                password: 'defaultpassword',
            },
            {
                name: 'Student Two',
                email: 'student2@example.com',
                role: 'STUDENT',
                password: 'defaultpassword',
            },
            {
                name: 'Student Three',
                email: 'student3@example.com',
                role: 'STUDENT',
                password: 'defaultpassword',
            },
        ],
    });

    console.log('Database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });