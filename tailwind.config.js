/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // Enable class-based dark mode
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				border: "var(--border)",
				primaryBg: '#b29a76',
				secondaryBg: '#f5f5f5',
				fontColor: '#1a1a1a',
				silverCustom: '#cfd0d2',
				blackCustom: '#1a1a1a',
				grayCustom: '#4c4c4c',
				whiteCustom: '#f5f5f5',
				brownCustom: '#b29a76',
			},
			fontFamily: {
				monorama: ['Monorama', 'sans-serif'],
				jetbrains: ['JetBrains Mono', 'monospace'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),


	],
};
