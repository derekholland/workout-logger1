'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '../components/ui/card';
import { Button } from '@/components/ui/button';

// Define the structure of a workout as received from the API
interface Set {
	id: number;
	reps: number;
	weight: number;
}

interface Exercise {
	id: number;
	name: string;
	sets: Set[];
}

interface Workout {
	id: number;
	title: string;
	date: string;
	exercises: Exercise[];
}

const Home = () => {
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWorkouts = async () => {
		try {
			const response = await fetch('/api/get-workouts');
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to fetch workouts.');
			}
			const data: Workout[] = await response.json();
			setWorkouts(data);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || 'An unexpected error occurred.');
			} else {
				setError('An unknown error occurred.');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkouts();
	}, []);

	return (
		<div className='max-w-2xl mx-auto p-6 min-h-screen transition-colors duration-300'>
			<h1 className='text-3xl font-bold mb-6 text-center text-gray-800 dark:text-slate-100'>
				Your Workouts
			</h1>

			{/* Log Workout Button */}
			<div className='mb-6 text-center'>
				<Link
					href='/workout'
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'>
					<Button>Log a New Workout</Button>
				</Link>
			</div>

			{/* Loading and Error States */}
			{loading && (
				<p className='text-gray-700 dark:text-gray-300'>Loading workouts...</p>
			)}
			{error && <p className='text-red-500'>{error}</p>}

			{!loading && !error && workouts.length === 0 && (
				<p className='text-gray-700 dark:text-gray-300'>
					No workouts logged yet.
				</p>
			)}

			{/* List of Workouts */}
			{!loading && !error && workouts.length > 0 && (
				<div className='space-y-4'>
					{workouts.map(workout => (
						<Card
							key={workout.id}
							className='bg-white dark:bg-primary-dark shadow-md rounded-lg transition-colors duration-300'>
							<CardHeader>
								<CardTitle className='text-lg font-medium text-gray-900 dark:text-white'>
									<div>{workout.title}</div>
									{new Date(workout.date).toLocaleDateString()}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div>
									{workout.exercises.map(exercise => {
										const finalSet = exercise.sets.slice(-1)[0];
										return (
											<div key={exercise.id} className='mt-2'>
												<p className='font-semibold text-gray-800 dark:text-gray-200'>
													{exercise.name}
												</p>
												{finalSet ? (
													<p className='text-sm text-gray-600 dark:text-gray-400'>
														Final Set: {finalSet.reps} reps @ {finalSet.weight}{' '}
														lbs
													</p>
												) : (
													<p className='text-sm text-gray-600 dark:text-gray-400'>
														No sets logged
													</p>
												)}
											</div>
										);
									})}
								</div>
							</CardContent>
							<CardFooter className='text-right'>
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
};

export default Home;
