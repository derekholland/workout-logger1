'use client';

// comment

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Workout {
	id: number;
	title: string;
	date: string;
	exercises: {
		id: number;
		name: string;
		sets: {
			id: number;
			reps: number;
			weight: number;
		}[];
	}[];
}

const Home: React.FC = () => {
	const [workouts, setWorkouts] = useState<Workout[]>([]);

	useEffect(() => {
		const fetchWorkouts = async () => {
			try {
				const response = await fetch('/api/get-workouts');
				if (!response.ok) {
					throw new Error('Failed to fetch workouts');
				}
				const data = await response.json();
				setWorkouts(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchWorkouts();
	}, []);

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Your Workouts</h1>

			<div className='mb-6 text-center'>
				<Link
					href='/workout'
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
					Log a New Workout
				</Link>
			</div>

			{workouts.length === 0 ? (
				<p>No workouts logged yet.</p>
			) : (
				<ul className='space-y-4'>
					{workouts.map(workout => (
						<li key={workout.id} className='p-4 bg-white rounded-lg shadow'>
							<Link href={`/workouts/${workout.id}`} className='block'>
								<div className='flex justify-between items-center'>
									<span className='text-lg font-medium'>{workout.title}</span>
									<span className='text-sm text-gray-500'>
										{new Date(workout.date).toLocaleDateString()}
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Home;
