// import { PrismaClient } from '@prisma/client';

// // Add PrismaClient to the NodeJS global type so it's not redefined on every hot reload in development
// declare global {
// 	// eslint-disable-next-line no-var
// 	var prisma: PrismaClient | undefined;
// }

// // Create the Prisma Client instance and export it
// const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// export { prisma };

import { PrismaClient } from '@prisma/client';

// Add PrismaClient as a global variable in development to avoid instantiating it multiple times
declare global {
	var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient and ensure it uses the production database
export const prisma =
	global.prisma ||
	new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL, // Ensures Prisma uses the production URL
			},
		},
	});

// Prevent multiple PrismaClient instances in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
