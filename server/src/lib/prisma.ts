import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
let prisma: PrismaClient;

if (!global.prisma) {
    global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma;
