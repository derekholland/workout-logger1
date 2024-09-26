import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // Prisma Client

interface Set {
	reps: number;
	weight: number;
}

interface Exercise {
	name: string;
	sets: Set[];
}

interface Workout {
	date: string;
	exercises: Exercise[];
}

export async function POST(req: Request) {
	const workout: Workout = await req.json(); // Parse JSON request body

	try {
		const newWorkout = await prisma.workout.create({
			data: {
				date: new Date(workout.date),
				exercises: {
					create: workout.exercises.map(exercise => ({
						name: exercise.name,
						sets: {
							create: exercise.sets, // Create associated sets for each exercise
						},
					})),
				},
			},
		});
		return NextResponse.json(newWorkout);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to create workout.' },
			{ status: 500 },
		);
	}
}
