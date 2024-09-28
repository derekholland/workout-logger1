import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // Adjust this import path if necessary

export async function GET() {
	try {
		const workouts = await prisma.workout.findMany({
			include: {
				exercises: {
					include: {
						sets: true,
					},
				},
			},
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
