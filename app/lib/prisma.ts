// import { PrismaClient } from '@prisma/client';

// let prisma: PrismaClient;

// // Add a type declaration for `globalThis`
// declare global {
// 	// eslint-disable-next-line no-var
// 	var prisma: PrismaClient | undefined;
// }

// // Initialize PrismaClient and prevent multiple instances in development
// if (process.env.NODE_ENV === 'production') {
// 	prisma = new PrismaClient(); // In production, just create a new instance
// } else {
// 	if (!global.prisma) {
// 		global.prisma = new PrismaClient(); // In development, attach to global object
// 	}
// 	prisma = global.prisma; // Reuse the same instance
// }

// export { prisma };

// prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

// Only create a new PrismaClient if it doesn't already exist (helps in local development)
export const prisma =
	global.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : [], // log in development
	});

// Prevent multiple instances of PrismaClient in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
