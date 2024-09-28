'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Set {
	reps: number;
	weight: number;
}

interface Exercise {
	name: string;
	sets: Set[];
}

interface Workout {
	title: string;
	date: string;
	exercises: Exercise[];
}

const exerciseOptions = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press'];

const LogWorkout: React.FC = () => {
	const [selectedExercise, setSelectedExercise] = useState<string>(''); // State for selected exercise
	const [workingWeight, setWorkingWeight] = useState<number | null>(null); // State for working weight
	const [sets, setSets] = useState<Set[]>([]); // State to store sets including warm-up and working set
	const [workout, setWorkout] = useState<Workout>({
		title: '', // New state for the workout title
		date: new Date().toISOString().split('T')[0],
		exercises: [],
	}); // State to store the full workout

	const router = useRouter(); // For navigation after submission

	// Calculate warm-up sets based on the working weight
	const calculateWarmupSets = (weight: number) => {
		const percentages = [0.6, 0.7, 0.8, 0.9, 1.0]; // 60%, 70%, 80%, 90%, 100%
		const warmup = percentages.map(percent => ({
			reps: percent === 1 ? 5 : Math.floor(5 / 2), // Fewer reps for warm-up sets (default 5 for working set)
			weight: Math.round(weight * percent), // Calculate weight for each percentage
		}));
		setSets(warmup);
	};

	// Handle changes to individual set weights
	const handleSetWeightChange = (index: number, newWeight: number) => {
		const updatedSets = [...sets];
		updatedSets[index].weight = newWeight;
		setSets(updatedSets);
	};

	// Handle changes to individual set reps
	const handleSetRepsChange = (index: number, newReps: number) => {
		const updatedSets = [...sets];
		updatedSets[index].reps = newReps;
		setSets(updatedSets);
	};

	// Handle working weight submission
	const handleWorkingWeightSubmit = () => {
		if (workingWeight) {
			calculateWarmupSets(workingWeight);
		}
	};

	// Add the current exercise and its sets to the workout
	const addExerciseToWorkout = () => {
		if (selectedExercise && sets.length > 0) {
			const newExercise: Exercise = {
				name: selectedExercise,
				sets: [...sets],
			};
			setWorkout({
				...workout,
				exercises: [...workout.exercises, newExercise],
			});
			// Reset for next exercise
			setSelectedExercise('');
			setWorkingWeight(null);
			setSets([]);
		}
	};

	// Submit the workout to the API
	const submitWorkout = async () => {
		try {
			const response = await fetch('/api/add-workout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(workout),
			});

			if (!response.ok) {
				throw new Error('Failed to log workout');
			}

			alert('Workout logged successfully!');
			router.push('/'); // Navigate back to the main page
		} catch (error) {
			console.error('Error logging workout:', error);
			alert('An error occurred while logging the workout.');
		}
	};

	return (
		<div className='max-w-lg mx-auto p-6 bg-gray-100 min-h-screen'>
			<h1 className='text-3xl font-bold mb-6 text-center'>Log a New Workout</h1>

			{/* Workout Title Input */}
			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>Workout Title:</label>
				<input
					type='text'
					value={workout.title}
					onChange={e => setWorkout({ ...workout, title: e.target.value })}
					className='w-full p-2 border rounded-lg'
					placeholder='Enter workout title'
				/>
			</div>

			{/* Date Picker */}
			<div className='mb-4'>
				<label className='block text-lg font-medium mb-2'>Workout Date:</label>
				<input
					type='date'
					value={workout.date}
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

			{/* Input for Working Weight */}
			{selectedExercise && (
				<div className='mb-4'>
					<label className='block text-lg font-medium mb-2'>
						Working Weight (lbs):
					</label>
					<input
						type='number'
						value={workingWeight || ''}
						onChange={e => setWorkingWeight(Number(e.target.value))}
						className='w-full p-2 border rounded-lg'
						placeholder='Enter working weight'
					/>
					<button
						onClick={handleWorkingWeightSubmit}
						className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-4'>
						Calculate Warm-Up Sets
					</button>
				</div>
			)}

			{/* Display and Edit Warm-Up Sets */}
			{sets.length > 0 && (
				<div className='mt-6'>
					<h3 className='text-lg font-semibold mb-2'>Warm-Up Sets:</h3>
					<ul className='space-y-4'>
						{sets.map((set, index) => (
							<li key={index} className='flex items-center space-x-4'>
								<span>Set {index + 1}:</span>
								<input
									type='number'
									value={set.weight}
									onChange={e =>
										handleSetWeightChange(index, Number(e.target.value))
									}
									className='w-24 p-2 border rounded-lg'
								/>
								<span>Weight</span>
								<input
									type='number'
									value={set.reps}
									onChange={e =>
										handleSetRepsChange(index, Number(e.target.value))
									}
									className='w-24 p-2 border rounded-lg'
								/>
								<span>Reps</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Add Exercise and Finish Workout */}
			<div className='flex space-x-4 mt-6'>
				<button
					onClick={addExerciseToWorkout}
					className='w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700'
					disabled={!selectedExercise || sets.length === 0}>
					Add Exercise
				</button>
				<button
					onClick={submitWorkout}
					className='w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700'
					disabled={workout.exercises.length === 0}>
					Finish Workout
				</button>
			</div>

			{/* Display the added exercises */}
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
