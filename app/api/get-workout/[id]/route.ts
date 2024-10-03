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
