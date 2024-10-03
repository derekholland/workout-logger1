// // app/api/get-workout/[id]/route.ts

// export async function GET(
// 	req: Request,
// 	{ params }: { params: { id: string } },
// ) {
// 	try {
// 		const workout = await prisma.workout.findUnique({
// 			where: { id: Number(params.id) }, // Find workout by ID
// 			include: { exercises: { include: { sets: true } } }, // Include exercises and sets
// 		});

// 		if (!workout) {
// 			return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
// 		}

// 		return NextResponse.json(workout);
// 	} catch (error) {
// 		console.error('Error fetching workout:', error);
// 		return NextResponse.json(
// 			{ error: 'Failed to fetch workout' },
// 			{ status: 500 },
// 		);
// 	}
// }

import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const workout = await prisma.workout.findUnique({
		where: { id: parseInt(params.id) },
		include: {
			exercises: {
				include: {
					sets: true,
				},
			},
		},
	});
	if (!workout)
		return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
	const response = NextResponse.json(workout);
	response.headers.set('Cache-Control', 'no-store'); // Disable cache
	return response;
}
