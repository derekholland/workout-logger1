import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

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

		const response = NextResponse.json(workouts);
		response.headers.set('Cache-Control', 'no-store'); // Disable caching
		return response;
	} catch (error) {
		console.error('Error fetching workouts:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch workouts' },
			{ status: 500 },
		);
	}
}
