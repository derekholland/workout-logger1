import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const workoutId = parseInt(params.id);

		await prisma.workout.delete({
			where: { id: workoutId },
		});

		// Create the response and disable caching
		const response = NextResponse.json({
			message: 'Workout deleted successfully',
		});
		response.headers.set('Cache-Control', 'no-store'); // Disable caching to ensure the delete is reflected
		return response;
	} catch (error) {
		console.error('Error deleting workout:', error);
		return NextResponse.json(
			{ error: 'Failed to delete workout' },
			{ status: 500 },
		);
	}
}
