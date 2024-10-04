'use client'
// context/ThemeContext.js
import {createContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
	const [theme, setTheme] = useState('light');
	
	// On mount, check if verification has already selected a theme
	useEffect(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			setTheme(storedTheme);
			document.documentElement.classList.add(storedTheme);
		}
	}, []);
	
	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		document.documentElement.classList.remove(theme);
		document.documentElement.classList.add(newTheme);
		localStorage.setItem('theme', newTheme);
	};
	
	return (
		<ThemeContext.Provider value={{theme, toggleTheme}}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
