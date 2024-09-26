'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Link } from 'react-router-dom';

interface Set {
	id?: number;
	reps: number;
	weight: number;
}

interface Exercise {
	id?: number;
	name: string;
	sets: Set[];
}

interface Workout {
	id: number;
	date: string;
	exercises: Exercise[];
}

const EditWorkout: React.FC = () => {
	const { id } = useParams(); // Get the workout ID from the URL
	const [workout, setWorkout] = useState<Workout | null>(null); // State to hold the workout data
	const [loading, setLoading] = useState<boolean>(true); // Loading state
	const [error, setError] = useState<string | null>(null); // Error state
	const [updating, setUpdating] = useState<boolean>(false); // Update state
	const [deleting, setDeleting] = useState<boolean>(false); // Delete state

	const router = useRouter();

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

	// Update a specific set's reps and weight
	const handleSetChange = (
		exerciseIndex: number,
		setIndex: number,
		field: 'reps' | 'weight',
		value: number,
	) => {
		if (workout) {
			const updatedWorkout = { ...workout };
			updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
			setWorkout(updatedWorkout);
		}
	};

	// Update workout in the database
	const updateWorkout = async () => {
		setUpdating(true); // Start updating
		try {
			const response = await fetch(`/api/update-workout/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(workout), // Send updated workout data
			});
			if (!response.ok) throw new Error('Failed to update workout');
			alert('Workout updated successfully');
			router.push('/'); // Navigate back to home
		} catch (error: unknown) {
			setError((error as Error).message);
		} finally {
			setUpdating(false); // Finish updating
		}
	};

	// Delete workout
	const deleteWorkout = async () => {
		if (confirm('Are you sure you want to delete this workout?')) {
			setDeleting(true); // Start deleting
			try {
				const response = await fetch(`/api/delete-workout/${id}`, {
					method: 'DELETE',
				});
				if (!response.ok) throw new Error('Failed to delete workout');
				alert('Workout deleted successfully');
				router.push('/'); // Navigate back to home
			} catch (error: unknown) {
				setError((error as Error).message);
			} finally {
				setDeleting(false); // Finish deleting
			}
		}
	};

	if (loading) return <p>Loading workout...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;

	return (
		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
			{workout ? (
				<>
					<h1 className='text-3xl font-bold mb-4'>
						Edit Workout on {new Date(workout.date).toLocaleString()}
					</h1>

					{workout.exercises.map((exercise, exerciseIndex) => (
						<div key={exerciseIndex} className='mb-6'>
							<h2 className='text-xl font-semibold mb-2'>{exercise.name}</h2>
							{exercise.sets.map((set, setIndex) => (
								<div key={setIndex} className='mb-2 flex space-x-4'>
									<label>
										Reps:
										<input
											type='number'
											value={set.reps}
											onChange={e =>
												handleSetChange(
													exerciseIndex,
													setIndex,
													'reps',
													+e.target.value,
												)
											}
											className='ml-2 p-2 border rounded'
										/>
									</label>
									<label>
										Weight (lbs):
										<input
											type='number'
											value={set.weight}
											onChange={e =>
												handleSetChange(
													exerciseIndex,
													setIndex,
													'weight',
													+e.target.value,
												)
											}
											className='ml-2 p-2 border rounded'
										/>
									</label>
								</div>
							))}
						</div>
					))}

					<button
						onClick={updateWorkout}
						className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mr-4'
						disabled={updating} // Disable button while updating
					>
						{updating ? 'Updating...' : 'Update Workout'}
					</button>

					<button
						onClick={deleteWorkout}
						className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
						disabled={deleting} // Disable button while deleting
					>
						{deleting ? 'Deleting...' : 'Delete Workout'}
					</button>
				</>
			) : (
				<p>No workout found.</p>
			)}
		</div>
	);
};

export default EditWorkout;
