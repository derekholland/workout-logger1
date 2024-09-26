'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

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
	date: string;
	exercises: Exercise[];
}

const WorkoutDetail: React.FC = () => {
	const { id } = useParams(); // Get the workout ID from the URL
	const [workout, setWorkout] = useState<Workout | null>(null); // State to hold the workout data
	const [loading, setLoading] = useState<boolean>(true); // Loading state
	const [error, setError] = useState<string | null>(null); // Error state

	// Fetch workout details by ID
	useEffect(() => {
		const fetchWorkout = async () => {
			try {
				const response = await fetch(`/api/get-workout/${id}`); // Fetch the workout by ID
				if (!response.ok) throw new Error('Failed to fetch workout');
				const data: Workout = await response.json();
				setWorkout(data);
			} catch (error: unknown) {
				setError((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchWorkout();
	}, [id]);

	if (loading) return <p>Loading workout...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			{workout ? (
				<>
					<h1 className='text-3xl font-bold mb-4'>
						Workout on {new Date(workout.date).toLocaleString()}
					</h1>

					<h2 className='text-2xl font-semibold mb-2'>Exercises</h2>
					<ul className='space-y-4'>
						{workout.exercises.map((exercise, index) => (
							<li key={index} className='bg-white p-4 rounded-lg shadow'>
								<h3 className='text-xl font-medium mb-2'>{exercise.name}</h3>
								<ul className='space-y-2'>
									{exercise.sets.map((set, setIndex) => (
										<li key={setIndex}>
											{set.reps} reps @ {set.weight} lbs
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>

					{/* Add a link to the Edit Workout page */}
					<Link
						href={`/update-workout/${id}`}
						className='block mt-4 text-blue-600'>
						Edit Workout
					</Link>
				</>
			) : (
				<p>No workout found.</p>
			)}
		</div>
	);
};

export default WorkoutDetail;
