/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				'blink-once': 'blink 0.7s ease-in-out 1',
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0 },
				},
			},
		},
	},
	plugins: [],
}
