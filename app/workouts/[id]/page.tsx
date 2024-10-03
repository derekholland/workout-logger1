'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Define the structure of a workout, exercise, and set
interface Set {
	reps: number;
	weight: number;
}

interface Exercise {
	name: string;
	sets: Set[];
}

interface Workout {
	id: number;
	title: string;
	date: string;
	exercises: Exercise[];
}

const WorkoutDetail = () => {
	const { id } = useParams(); // Extract the workout ID from the URL
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchWorkout = async () => {
			try {
				const response = await fetch(`/api/get-workout/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch workout details');
				}
				const data: Workout = await response.json();
				setWorkout(data);
			} catch {
				setError('An error occurred while fetching the workout details');
			} finally {
				setLoading(false);
			}
		};

		fetchWorkout();
	}, [id]);

	if (loading) {
		return <p>Loading workout details...</p>;
	}

	if (error) {
		return <p className='text-red-500'>{error}</p>;
	}

	if (!workout) {
		return <p>No workout found.</p>;
	}

	return (
		<Card className='max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
			<CardHeader>
				<CardTitle className='text-lg font-medium text-gray-900 dark:text-white'>
					Workout: {workout.title}
				</CardTitle>
				<p className='text-gray-600 dark:text-gray-400'>
					Date: {new Date(workout.date).toLocaleDateString()}
				</p>
			</CardHeader>

			<CardContent>
				{workout.exercises.map((exercise, index) => (
					<div key={index} className='mb-6'>
						<h3 className='text-md font-semibold text-gray-800 dark:text-gray-300'>
							{exercise.name}
						</h3>
						<ul className='ml-4'>
							{exercise.sets.map((set, setIndex) => (
								<li key={setIndex} className='text-gray-700 dark:text-gray-400'>
									Set {setIndex + 1}: {set.reps} reps @ {set.weight} lbs
								</li>
							))}
						</ul>
					</div>
				))}
				<Link
					href={`/update-workout/${id}`}
					className='block mt-4 text-blue-600'>
					Edit Workout
				</Link>
			</CardContent>
		</Card>
	);
};

export default WorkoutDetail;
