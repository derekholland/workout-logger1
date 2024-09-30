import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Add a type declaration for `globalThis`
declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient and prevent multiple instances in development
if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient(); // In production, just create a new instance
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient(); // In development, attach to global object
	}
	prisma = global.prisma; // Reuse the same instance
}

export { prisma };
