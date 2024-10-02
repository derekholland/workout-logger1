import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';

const ToggleMode = () => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode]);

	return (
		<Button
			onClick={() => setDarkMode(!darkMode)}
			className='dark:text-slate-100'>
			{darkMode ? 'Light Mode' : 'Dark Mode'}
		</Button>
	);
};

export default ToggleMode;
