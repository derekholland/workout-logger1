// components/Navbar.js
'use client';
import Link from 'next/link';
import ToggleMode from './ToggleMode';

const Navbar = () => {
	return (
		<nav className=' dark:text-secondary-dark  light:text-secondary-light p-4 mb-10'>
			<div className='container mx-auto flex justify-between items-center'>
				<div className='text-2xl font-bold'>
					<Link href='/' className='dark:text-slate-100'>
						Workout Logger
					</Link>
				</div>
				<div className='hidden md:flex space-x-4'>
					<Link
						href='/workout'
						className='px-3 py-2 rounded-md text-sm font-medium'>
						New Workout
					</Link>
				</div>
				<ToggleMode />
			</div>
		</nav>
	);
};

export default Navbar;
