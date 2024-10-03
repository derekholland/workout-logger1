'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
			} catch {
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

	const handleDeleteWorkout = async () => {
		try {
			const response = await fetch(`/api/delete-workout/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete workout');
			}
			// Reload the page after deletion to ensure updated data
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
					<Button type='submit' className='w-full mb-4'>
						Update Workout
					</Button>
				</form>

				{/* Delete Button */}
				<Button
					variant='destructive'
					onClick={handleDeleteWorkout}
					className='w-full'>
					Delete Workout
				</Button>
			</CardContent>
		</Card>
	);
};

export default UpdateWorkout;
