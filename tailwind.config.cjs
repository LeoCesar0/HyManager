/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{html,js,jsx,tsx,ts}'],
	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
			'2xl': '1600px'
		},
		extend: {
			spacing: {
				128: '32rem',
				144: '36rem'
			},
			colors: (theme) => ({
				'primary': 'var(--color-primary)',
				'on-primary': 'var(--color-on-primary)',
				'primary-hover': 'var(--color-primary-hover)',
				'secondary': 'var(--color-secondary)',
				'on-secondary': 'var(--color-on-secondary)',
				'secondary-hover': 'var(--color-secondary-hover)',
				'surface': 'var(--color-surface)',
				'on-surface': 'var(--color-on-surface)',
				'surface2': 'var(--color-surface2)',
				'on-surface2': 'var(--color-on-surface2)',
				'background': 'var(--color-background)',
				'on-background': 'var(--color-on-background)',
				'hint': 'var(--color-hint)',
			}),
		}
	},
	plugins: []
};
