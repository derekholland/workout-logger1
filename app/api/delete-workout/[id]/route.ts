import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		await prisma.workout.delete({ where: { id: Number(params.id) } });
		return NextResponse.json({ message: 'Workout deleted successfully.' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to delete workout.' },
			{ status: 500 },
		);
	}
}
