// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// interface Set {
// 	id?: number;
// 	reps: number;
// 	weight: number;
// }

// interface Exercise {
// 	id?: number;
// 	name: string;
// 	sets: Set[];
// }

// interface Workout {
// 	id: number;
// 	date: string;
// 	exercises: Exercise[];
// }

// const EditWorkout: React.FC = () => {
// 	const { id } = useParams(); // Get the workout ID from the URL
// 	const [workout, setWorkout] = useState<Workout | null>(null); // State to hold the workout data
// 	const [loading, setLoading] = useState<boolean>(true); // Loading state
// 	const [error, setError] = useState<string | null>(null); // Error state
// 	const [updating, setUpdating] = useState<boolean>(false); // Update state
// 	const [deleting, setDeleting] = useState<boolean>(false); // Delete state

// 	const router = useRouter();

// 	// Fetch workout details by ID
// 	useEffect(() => {
// 		const fetchWorkout = async () => {
// 			try {
// 				const response = await fetch(`/api/get-workout/${id}`); // Fetch the workout by ID
// 				if (!response.ok) throw new Error('Failed to fetch workout');
// 				const data: Workout = await response.json();
// 				setWorkout(data);
// 			} catch (error: unknown) {
// 				setError((error as Error).message);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchWorkout();
// 	}, [id]);

// 	// Update a specific set's reps and weight
// 	const handleSetChange = (
// 		exerciseIndex: number,
// 		setIndex: number,
// 		field: 'reps' | 'weight',
// 		value: number,
// 	) => {
// 		if (workout) {
// 			const updatedWorkout = { ...workout };
// 			updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
// 			setWorkout(updatedWorkout);
// 		}
// 	};

// 	// Update workout in the database
// 	const updateWorkout = async () => {
// 		setUpdating(true); // Start updating
// 		try {
// 			const response = await fetch(`/api/update-workout/${id}`, {
// 				method: 'PUT',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify(workout), // Send updated workout data
// 			});
// 			if (!response.ok) throw new Error('Failed to update workout');
// 			alert('Workout updated successfully');
// 			router.push('/'); // Navigate back to home
// 		} catch (error: unknown) {
// 			setError((error as Error).message);
// 		} finally {
// 			setUpdating(false); // Finish updating
// 		}
// 	};

// 	// Delete workout
// 	const deleteWorkout = async () => {
// 		if (confirm('Are you sure you want to delete this workout?')) {
// 			setDeleting(true); // Start deleting
// 			try {
// 				const response = await fetch(`/api/delete-workout/${id}`, {
// 					method: 'DELETE',
// 				});
// 				if (!response.ok) throw new Error('Failed to delete workout');
// 				alert('Workout deleted successfully');
// 				router.push('/'); // Navigate back to home
// 			} catch (error: unknown) {
// 				setError((error as Error).message);
// 			} finally {
// 				setDeleting(false); // Finish deleting
// 			}
// 		}
// 	};

// 	if (loading) return <p>Loading workout...</p>;
// 	if (error) return <p className='text-red-500'>{error}</p>;

// 	return (
// 		<div className='max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen'>
// 			{workout ? (
// 				<>
// 					<h1 className='text-3xl font-bold mb-4'>
// 						Edit Workout on {new Date(workout.date).toLocaleString()}
// 					</h1>

// 					{workout.exercises.map((exercise, exerciseIndex) => (
// 						<div key={exerciseIndex} className='mb-6'>
// 							<h2 className='text-xl font-semibold mb-2'>{exercise.name}</h2>
// 							{exercise.sets.map((set, setIndex) => (
// 								<div key={setIndex} className='mb-2 flex space-x-4'>
// 									<label>
// 										Reps:
// 										<input
// 											type='number'
// 											value={set.reps}
// 											onChange={e =>
// 												handleSetChange(
// 													exerciseIndex,
// 													setIndex,
// 													'reps',
// 													+e.target.value,
// 												)
// 											}
// 											className='ml-2 p-2 border rounded'
// 										/>
// 									</label>
// 									<label>
// 										Weight (lbs):
// 										<input
// 											type='number'
// 											value={set.weight}
// 											onChange={e =>
// 												handleSetChange(
// 													exerciseIndex,
// 													setIndex,
// 													'weight',
// 													+e.target.value,
// 												)
// 											}
// 											className='ml-2 p-2 border rounded'
// 										/>
// 									</label>
// 								</div>
// 							))}
// 						</div>
// 					))}

// 					<button
// 						onClick={updateWorkout}
// 						className='bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mr-4'
// 						disabled={updating} // Disable button while updating
// 					>
// 						{updating ? 'Updating...' : 'Update Workout'}
// 					</button>

// 					<button
// 						onClick={deleteWorkout}
// 						className='bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700'
// 						disabled={deleting} // Disable button while deleting
// 					>
// 						{deleting ? 'Deleting...' : 'Delete Workout'}
// 					</button>
// 				</>
// 			) : (
// 				<p>No workout found.</p>
// 			)}
// 		</div>
// 	);
// };

// export default EditWorkout;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

const UpdateWorkout = () => {
	const { id } = useParams(); // Get the workout ID from the URL
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [title, setTitle] = useState('');
	const [date, setDate] = useState('');
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchWorkout = async () => {
			try {
				const response = await fetch(`/api/get-workout/${id}`);
				if (!response.ok) {
					throw new Error('Failed to fetch workout details');
				}
				const data: Workout = await response.json();
				setWorkout(data);
				setTitle(data.title);
				setDate(data.date);
				setExercises(data.exercises);
			} catch (err: unknown) {
				setError('An error occurred while fetching the workout details');
			} finally {
				setLoading(false);
			}
		};

		fetchWorkout();
	}, [id]);

	const handleUpdateWorkout = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title || !date || exercises.length === 0) {
			alert('Please enter a workout title, date, and at least one exercise');
			return;
		}

		const updatedWorkout = {
			title,
			date,
			exercises,
		};

		try {
			const response = await fetch(`/api/update-workout/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedWorkout),
			});

			if (!response.ok) {
				throw new Error('Failed to update workout');
			}

			router.push('/');
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			} else {
				alert('An unknown error occurred.');
			}
		}
	};

	const handleExerciseChange = (index: number, name: string) => {
		const updatedExercises = exercises.map((exercise, i) => {
			if (i === index) {
				return { ...exercise, name };
			}
			return exercise;
		});
		setExercises(updatedExercises);
	};

	const handleSetChange = (
		exerciseIndex: number,
		setIndex: number,
		field: 'reps' | 'weight',
		value: string,
	) => {
		const updatedExercises = exercises.map((exercise, i) => {
			if (i === exerciseIndex) {
				const updatedSets = exercise.sets.map((set, j) => {
					if (j === setIndex) {
						return { ...set, [field]: Number(value) };
					}
					return set;
				});
				return { ...exercise, sets: updatedSets };
			}
			return exercise;
		});
		setExercises(updatedExercises);
	};

	if (loading) {
		return <p>Loading workout...</p>;
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
					Update Workout: {workout.title}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleUpdateWorkout}>
					{/* Workout Title */}
					<div className='mb-4'>
						<Label
							htmlFor='title'
							className='block text-gray-800 dark:text-gray-300'>
							Workout Title
						</Label>
						<Input
							id='title'
							type='text'
							placeholder='Enter workout title'
							value={title}
							onChange={e => setTitle(e.target.value)}
							className='w-full mt-1'
						/>
					</div>

					{/* Workout Date */}
					<div className='mb-4'>
						<Label
							htmlFor='date'
							className='block text-gray-800 dark:text-gray-300'>
							Workout Date
						</Label>
						<Input
							id='date'
							type='date'
							value={date}
							onChange={e => setDate(e.target.value)}
							className='w-full mt-1'
						/>
					</div>

					{/* Exercises and Sets */}
					{exercises.map((exercise, exerciseIndex) => (
						<div key={exerciseIndex} className='mb-6'>
							<h3 className='text-md font-semibold text-gray-800 dark:text-gray-300'>
								Exercise {exerciseIndex + 1}
							</h3>
							<Input
								type='text'
								value={exercise.name}
								onChange={e =>
									handleExerciseChange(exerciseIndex, e.target.value)
								}
								className='w-full mt-1 mb-2'
								placeholder='Enter exercise name'
							/>

							{exercise.sets.map((set, setIndex) => (
								<div key={setIndex} className='flex space-x-4 mb-2'>
									<div>
										<Label
											htmlFor={`reps-${exerciseIndex}-${setIndex}`}
											className='block text-gray-800 dark:text-gray-300'>
											Reps
										</Label>
										<Input
											id={`reps-${exerciseIndex}-${setIndex}`}
											type='number'
											value={set.reps}
											onChange={e =>
												handleSetChange(
													exerciseIndex,
													setIndex,
													'reps',
													e.target.value,
												)
											}
											className='mt-1'
										/>
									</div>
									<div>
										<Label
											htmlFor={`weight-${exerciseIndex}-${setIndex}`}
											className='block text-gray-800 dark:text-gray-300'>
											Weight (lbs)
										</Label>
										<Input
											id={`weight-${exerciseIndex}-${setIndex}`}
											type='number'
											value={set.weight}
											onChange={e =>
												handleSetChange(
													exerciseIndex,
													setIndex,
													'weight',
													e.target.value,
												)
											}
											className='mt-1'
										/>
									</div>
								</div>
							))}
						</div>
					))}

					{/* Submit Button */}
					<Button type='submit' className='w-full'>
						Update Workout
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default UpdateWorkout;
