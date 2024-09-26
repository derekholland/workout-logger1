'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Set {
	reps: number;
	weight: number;
}

interface Exercise {
	name: string;
	sets: Set[];
}

interface Workout {
	date: string;
	exercises: Exercise[];
}

// Log a new workout. Displays when you click add a new workout button

const exerciseOptions = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press']; // Example exercise options

const LogWorkout: React.FC = () => {
	const [workout, setWorkout] = useState<Workout>({
		date: new Date().toISOString().split('T')[0],
		exercises: [],
	});
	const [selectedExercise, setSelectedExercise] = useState<string>(''); // State for selected exercise
	const [reps, setReps] = useState<number>(0); // State for reps input
	const [weight, setWeight] = useState<number>(0); // State for weight input
	const [currentSets, setCurrentSets] = useState<Set[]>([]); // State to store the current exercise's sets

	const router = useRouter();

	// Function to handle adding a set to the current exercise
	const addSet = () => {
		setCurrentSets([...currentSets, { reps, weight }]);
		setReps(0);
		setWeight(0);
	};

	// Function to add the current exercise (with its sets) to the workout
	const addExerciseToWorkout = () => {
		const newExercise: Exercise = { name: selectedExercise, sets: currentSets };
		setWorkout({ ...workout, exercises: [...workout.exercises, newExercise] });
		setSelectedExercise(''); // Reset for the next exercise
		setCurrentSets([]); // Clear the sets for the next exercise
	};

	// Function to handle submitting the workout
	const submitWorkout = async () => {
		try {
			const response = await fetch('/api/add-workout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(workout),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to log workout');
			}

			alert('Workout logged successfully!');
			router.push('/'); // Navigate back to home page after submission
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			} else {
				alert('An unknown error occurred');
			}
		}
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Log a New Workout</h1>

			{/* Date Picker */}
			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>Workout Date:</label>
				<input
					type='date'
					value={workout.date.split('T')[0]}
					onChange={e => setWorkout({ ...workout, date: e.target.value })}
					className='w-full p-2 border rounded-lg'
				/>
			</div>

			{/* Exercise Dropdown */}
			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>
					Select Exercise:
				</label>
				<select
					value={selectedExercise}
					onChange={e => setSelectedExercise(e.target.value)}
					className='w-full p-2 border rounded-lg'>
					<option value='' disabled>
						Select an exercise
					</option>
					{exerciseOptions.map(exercise => (
						<option key={exercise} value={exercise}>
							{exercise}
						</option>
					))}
				</select>
			</div>

			{/* Set Reps and Weight */}
			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>Reps:</label>
				<input
					type='number'
					value={reps}
					onChange={e => setReps(Number(e.target.value))}
					className='w-full p-2 border rounded-lg'
					placeholder='Enter reps'
				/>
			</div>

			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>Weight (lbs):</label>
				<input
					type='number'
					value={weight}
					onChange={e => setWeight(Number(e.target.value))}
					className='w-full p-2 border rounded-lg'
					placeholder='Enter weight'
				/>
			</div>

			{/* Add Set Button */}
			<button
				onClick={addSet}
				className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mb-4'>
				Add Set
			</button>

			{/* Display Current Sets */}
			{currentSets.length > 0 && (
				<div className='mb-4'>
					<h3 className='text-lg font-semibold mb-2'>Current Sets:</h3>
					<ul className='list-disc pl-5'>
						{currentSets.map((set, index) => (
							<li key={index}>
								{set.reps} reps @ {set.weight} lbs
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Add Exercise or Finish Workout */}
			<div className='flex space-x-4'>
				<button
					onClick={addExerciseToWorkout}
					className='w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700'
					disabled={!selectedExercise || currentSets.length === 0}>
					Add Exercise
				</button>
				<button
					onClick={submitWorkout}
					className='w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700'
					disabled={workout.exercises.length === 0}>
					Finish Workout
				</button>
			</div>
			<div className='mt-10'>
				<Link href='/'>Home</Link>
			</div>

			{/* Display Current Workout */}
			{workout.exercises.length > 0 && (
				<div className='mt-6'>
					<h3 className='text-lg font-semibold mb-2'>Current Workout:</h3>
					<ul className='list-disc pl-5'>
						{workout.exercises.map((exercise, index) => (
							<li key={index}>
								<strong>{exercise.name}</strong>
								<ul className='list-disc pl-5'>
									{exercise.sets.map((set, setIndex) => (
										<li key={setIndex}>
											{set.reps} reps @ {set.weight} lbs
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default LogWorkout;
