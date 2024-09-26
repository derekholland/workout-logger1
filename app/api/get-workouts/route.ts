// app/api/get-workouts/route.ts

import { prisma } from '../../lib/prisma'; // Import the Prisma client
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const workouts = await prisma.workout.findMany({
			include: { exercises: { include: { sets: true } } }, // Include related exercises and sets
		});
		return NextResponse.json(workouts);
	} catch (error) {
		console.error('Error fetching workouts:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch workouts' },
			{ status: 500 },
		);
	}
}
