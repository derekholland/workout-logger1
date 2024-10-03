// app/api/update-workout/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

interface Set {
	id?: number;
	reps: number;
	weight: number;
}

interface Exercise {
	id?: number;
	name: string;
	sets: Set[];
}

interface UpdateData {
	date?: string;
	exercises: Exercise[];
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const workoutId = parseInt(params.id); // Parse workout ID from URL
	const updateData: UpdateData = await req.json(); // Parse incoming JSON data

	try {
		const updatedWorkout = await prisma.workout.update({
			where: { id: workoutId }, // Match the workout by ID
			data: {
				date: updateData.date ? new Date(updateData.date) : undefined,
				exercises: {
					upsert: updateData.exercises.map(exercise => ({
						where: { id: exercise.id }, // Match the exercise by ID
						create: {
							name: exercise.name,
							sets: {
								create: exercise.sets.map(set => ({
									reps: set.reps,
									weight: set.weight,
								})),
							},
						},
						update: {
							name: exercise.name,
							sets: {
								deleteMany: {}, // Delete all old sets
								create: exercise.sets.map(set => ({
									reps: set.reps,
									weight: set.weight,
								})),
							},
						},
					})),
				},
			},
		});

		// Create the response and disable caching
		const response = NextResponse.json(updatedWorkout);
		response.headers.set('Cache-Control', 'no-store'); // Ensure changes reflect immediately
		return response;

		// return NextResponse.json(updatedWorkout); // Return updated workout
	} catch (error) {
		console.error('Error updating workout:', error); // Log any errors
		return NextResponse.json(
			{ error: 'Failed to update workout.' },
			{ status: 500 },
		);
	}
}
