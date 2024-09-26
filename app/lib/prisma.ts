import { PrismaClient } from '@prisma/client';

// Add PrismaClient to the NodeJS global type so it's not redefined on every hot reload in development
declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// Create the Prisma Client instance and export it
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
