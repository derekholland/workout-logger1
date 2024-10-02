// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
// 	Card,
// 	CardHeader,
// 	CardTitle,
// 	CardContent,
// 	CardFooter,
// } from '../../components/ui/card';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select } from '../../components/ui/select';

// interface Set {
// 	reps: number;
// 	weight: number;
// }

// interface Exercise {
// 	name: string;
// 	sets: Set[];
// }

// const WorkoutForm = () => {
// 	const [exercise, setExercise] = useState('');
// 	const [workingWeight, setWorkingWeight] = useState('');
// 	const [sets, setSets] = useState<Set[]>([]);
// 	const [reps, setReps] = useState('');
// 	const [exercises, setExercises] = useState<Exercise[]>([]);
// 	const [workoutTitle, setWorkoutTitle] = useState('');
// 	const router = useRouter();

// 	const exerciseOptions = [
// 		'Squat',
// 		'Bench Press',
// 		'Deadlift',
// 		'Overhead Press',
// 	]; // Example exercise options

// 	// Function to calculate warm-up sets based on the working weight
// 	const calculateWarmUpSets = (weight: number) => {
// 		return [
// 			{ reps: 5, weight: Math.round(weight * 0.6) },
// 			{ reps: 5, weight: Math.round(weight * 0.7) },
// 			{ reps: 3, weight: Math.round(weight * 0.8) },
// 			{ reps: 2, weight: Math.round(weight * 0.9) },
// 			{ reps: 1, weight: weight }, // Final working set
// 		];
// 	};

// 	// Add the calculated warm-up sets
// 	const addWarmUpSets = () => {
// 		if (workingWeight) {
// 			const weight = Number(workingWeight);
// 			const newSets = calculateWarmUpSets(weight);
// 			setSets([...sets, ...newSets]);
// 			setReps('');
// 			setWorkingWeight('');
// 		}
// 	};

// 	// Add the current exercise to the workout
// 	const addExercise = () => {
// 		if (exercise && sets.length > 0) {
// 			const newExercise: Exercise = { name: exercise, sets };
// 			setExercises([...exercises, newExercise]);
// 			setExercise('');
// 			setSets([]);
// 		}
// 	};

// 	// Handle form submission to save workout
// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		if (!workoutTitle || exercises.length === 0) {
// 			alert('Please enter a workout title and add at least one exercise');
// 			return;
// 		}

// 		const workout = {
// 			title: workoutTitle,
// 			exercises,
// 		};

// 		try {
// 			const response = await fetch('/api/add-workout', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify(workout),
// 			});

// 			if (!response.ok) {
// 				throw new Error('Failed to log workout');
// 			}

// 			router.push('/');
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				alert(error.message);
// 			} else {
// 				alert('An unknown error occurred.');
// 			}
// 		}
// 	};

// 	return (
// 		<Card className='max-w-lg mx-auto mt-10 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
// 			<CardHeader>
// 				<CardTitle className='text-lg font-medium text-gray-900 dark:text-white'>
// 					Log a New Workout
// 				</CardTitle>
// 			</CardHeader>

// 			<CardContent>
// 				<form onSubmit={handleSubmit}>
// 					{/* Workout Title */}
// 					<div className='mb-4'>
// 						<Label
// 							htmlFor='workoutTitle'
// 							className='block text-gray-800 dark:text-gray-300'>
// 							Workout Title
// 						</Label>
// 						<Input
// 							id='workoutTitle'
// 							type='text'
// 							placeholder='Enter workout title'
// 							value={workoutTitle}
// 							onChange={e => setWorkoutTitle(e.target.value)}
// 							className='w-full mt-1'
// 						/>
// 					</div>

// 					{/* Exercise Dropdown */}
// 					<div className='mb-4'>
// 						<Label
// 							htmlFor='exercise'
// 							className='block text-gray-800 dark:text-gray-300'>
// 							Select Exercise
// 						</Label>
// 						<Select
// 							id='exercise'
// 							value={exercise}
// 							onChange={e => setExercise(e.target.value)}
// 							className='w-full mt-1'>
// 							<option value=''>Select an exercise</option>
// 							{exerciseOptions.map(option => (
// 								<option key={option} value={option}>
// 									{option}
// 								</option>
// 							))}
// 						</Select>
// 					</div>

// 					{/* Working Weight Input */}
// 					<div className='mb-4'>
// 						<Label
// 							htmlFor='workingWeight'
// 							className='block text-gray-800 dark:text-gray-300'>
// 							Working Weight (lbs)
// 						</Label>
// 						<Input
// 							id='workingWeight'
// 							type='number'
// 							placeholder='Enter working weight'
// 							value={workingWeight}
// 							onChange={e => setWorkingWeight(e.target.value)}
// 							className='w-full mt-1'
// 						/>
// 					</div>

// 					{/* Add Warm-Up Sets Button */}
// 					<Button type='button' onClick={addWarmUpSets} className='mb-4'>
// 						Calculate Warm-Up Sets
// 					</Button>

// 					{/* Display Warm-Up Sets */}
// 					{sets.length > 0 && (
// 						<div className='mb-4'>
// 							<h4 className='text-gray-800 dark:text-gray-300'>Sets</h4>
// 							<ul>
// 								{sets.map((set, index) => (
// 									<li key={index} className='text-gray-600 dark:text-gray-400'>
// 										{set.reps} reps @ {set.weight} lbs
// 									</li>
// 								))}
// 							</ul>
// 						</div>
// 					)}

// 					{/* Add Exercise Button */}
// 					<Button type='button' onClick={addExercise} className='mb-4'>
// 						Add Exercise
// 					</Button>

// 					{/* Display Added Exercises */}
// 					{exercises.length > 0 && (
// 						<div className='mb-4'>
// 							<h4 className='text-gray-800 dark:text-gray-300'>Exercises</h4>
// 							<ul>
// 								{exercises.map((ex, index) => (
// 									<li key={index} className='text-gray-600 dark:text-gray-400'>
// 										{ex.name} - {ex.sets.length} sets
// 									</li>
// 								))}
// 							</ul>
// 						</div>
// 					)}

// 					{/* Submit Button */}
// 					<Button type='submit' className='w-full'>
// 						Finish Workout
// 					</Button>
// 				</form>
// 			</CardContent>
// 		</Card>
// 	);
// };

// export default WorkoutForm;
