import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // Adjust the import path to match your prisma setup

export async function POST(request: Request) {
	try {
		const body = await request.json(); // Parse incoming workout data

		// Save the workout to the database
		const newWorkout = await prisma.workout.create({
			data: {
				title: body.title,
				date: new Date(body.date),
				exercises: {
					create: body.exercises.map((exercise: any) => ({
						name: exercise.name,
						sets: {
							create: exercise.sets.map((set: any) => ({
								reps: set.reps,
								weight: set.weight,
							})),
						},
					})),
				},
			},
		});

		return NextResponse.json({
			message: 'Workout created successfully',
			workout: newWorkout,
		});
	} catch (error) {
		console.error('Error creating workout:', error);
		return NextResponse.json(
			{ error: 'Failed to create workout' },
			{ status: 500 },
		);
	}
}
