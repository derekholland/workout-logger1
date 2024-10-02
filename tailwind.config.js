/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: 'class', // Use class-based dark mode
	theme: {
		extend: {
			colors: {
				primary: {
					light: '#6366f1', // Light mode primary color
					dark: '#09090b', // Dark mode primary color
				},
				secondary: {
					light: '#22d3ee',
					dark: '#f8fafc',
				},
				// Add any other color variants here
			},
		},
	},
	plugins: [],
};
