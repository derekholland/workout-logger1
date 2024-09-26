'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Define the structure of a workout as received from the API
interface Set {
	reps: number;
	weight: number;
}

interface Exercise {
	name: string;
	sets: Set[];
}

interface Workout {
	id: number; // Unique identifier for the workout
	date: string; // Date of the workout
	exercises: Exercise[]; // Array of exercises in the workout
}

const Home: React.FC = () => {
	const [workouts, setWorkouts] = useState<Workout[]>([]); // State to hold the workouts
	const [loading, setLoading] = useState<boolean>(true); // Loading state
	const [error, setError] = useState<string | null>(null); // Error state

	// Fetch workouts from the API when the component mounts
	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const response = await fetch('/api/get-workouts'); // Fetch all workouts
				if (!response.ok) {
					throw new Error('Failed to fetch workouts');
				}
				const data: Workout[] = await response.json();
				setWorkouts(data);
			} catch (error: unknown) {
				setError((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkouts();
	}, []);

	if (loading) return <p>Loading workouts...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Your Workouts</h1>
			<div className='mb-10'>
				<Link href='/workout'>Add Workout</Link>
			</div>

			{/* Display the list of workouts */}
			{workouts.length > 0 ? (
				<ul className='space-y-4'>
					{workouts.map(workout => (
						<li key={workout.id} className='p-4 bg-white rounded-lg shadow'>
							<Link href={`/workouts/${workout.id}`} className='block'>
								<div className='flex justify-between'>
									<span className='text-lg font-medium'>
										{new Date(workout.date).toLocaleString()}{' '}
										{/* Format the date */}
									</span>
									<span className='text-sm text-gray-500'>
										{workout.exercises.length} Exercises
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p>No workouts logged yet.</p>
			)}
		</div>
	);
};

export default Home;
