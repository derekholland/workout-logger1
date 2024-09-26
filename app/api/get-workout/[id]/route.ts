// app/api/get-workout/[id]/route.ts

import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const workout = await prisma.workout.findUnique({
			where: { id: Number(params.id) }, // Find workout by ID
			include: { exercises: { include: { sets: true } } }, // Include exercises and sets
		});

		if (!workout) {
			return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
		}

		return NextResponse.json(workout);
	} catch (error) {
		console.error('Error fetching workout:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch workout' },
			{ status: 500 },
		);
	}
}
