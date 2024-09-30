'use client'; // Enables client-side rendering for this component

import React, { useEffect, useState } from 'react'; // Import React and hooks
import Link from 'next/link'; // Import Link component for client-side navigation

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
	const [workouts, setWorkouts] = useState<Workout[]>([]); // State to hold the list of workouts
	const [loading, setLoading] = useState<boolean>(true); // State to manage loading status
	const [error, setError] = useState<string | null>(null); // State to manage error messages

	/**
	 * fetchWorkouts
	 * Asynchronously fetches the list of workouts from the API.
	 */
	const fetchWorkouts = async () => {
		try {
			const response = await fetch('/api/get-workouts'); // Fetch data from the API
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to fetch workouts.');
			}
			const data: Workout[] = await response.json(); // Parse the JSON data
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
		fetchWorkouts(); // Invoke the fetchWorkouts function when the component mounts
	}, []); // Empty dependency array ensures this runs only once on mount

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Your Workouts</h1>

			{/* Link to the Log Workout page */}
			<div className='mb-6 text-center'>
				<Link
					href='/workout'
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
					Log a New Workout
				</Link>
			</div>

			{/* Display loading state */}
			{loading && <p>Loading workouts...</p>}

			{/* Display error message if any */}
			{error && <p className='text-red-500'>{error}</p>}

			{/* Display message if no workouts are logged */}
			{!loading && !error && workouts.length === 0 && (
				<p>No workouts logged yet.</p>
			)}

			{/* Display list of workouts if available */}
			{!loading && !error && workouts.length > 0 && (
				<ul className='space-y-4'>
					{workouts.map(workout => (
						<li key={workout.id} className='p-4 bg-white rounded-lg shadow'>
							<Link href={`/workouts/${workout.id}`} className='block'>
								<h2 className='font-medium'>{workout.title}</h2>
								<h3>{new Date(workout.date).toLocaleDateString()}</h3>

								{/* Iterate through each exercise in the workout */}
								<ul>
									{workout.exercises.map(exercise => {
										// Get the final (working) set for the exercise
										const finalSet = exercise.sets.slice(-1)[0];

										return (
											<li key={exercise.id} className='mt-2'>
												{/* <p className='font-semibold'>{exercise.name}</p> */}

												{finalSet ? (
													<p className='text-sm text-gray-600'>
														{exercise.name} {finalSet.reps} reps X{' '}
														{finalSet.weight} lbs
													</p>
												) : (
													<p className='text-sm text-gray-600'>
														No sets logged
													</p>
												)}
											</li>
										);
									})}
								</ul>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Home;
