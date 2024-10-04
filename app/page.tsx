'use client';

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

export default function MainPage() {
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWorkouts = async () => {
		try {
			const response = await fetch('/api/get-workouts', {
				cache: 'no-store', // Disable caching to get fresh data
			});

			if (!response.ok) {
				throw new Error('Failed to fetch workouts');
			}

			const data = await response.json();
			setWorkouts(data);
		} catch {
			setError('Error loading workouts');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkouts();
	}, []); // Ensure this only runs once on mount

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Your Workouts</h1>

			{workouts.length === 0 && <p>No workouts available.</p>}

			{workouts.length > 0 && (
				<div className='space-y-4'>
					{workouts.map(workout => (
						<Card
							key={workout.id}
							className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-4'>
							<CardHeader>
								<CardTitle className='text-lg font-medium text-gray-900 dark:text-white'>
									{workout.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-gray-600 dark:text-gray-400'>
									{new Date(workout.date).toLocaleDateString()}
								</p>
								<ul className='mt-2'>
									{workout.exercises.map((exercise, index) => (
										<li
											key={index}
											className='text-gray-800 dark:text-gray-300'>
											{exercise.name} - {exercise.sets.length} sets
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter className='text-right'>
								{' '}
								<Link
									href={`/workouts/${workout.id}`}
									className='text-blue-600 dark:text-blue-400 hover:underline'>
									View Details
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

//test
