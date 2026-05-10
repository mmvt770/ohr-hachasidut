/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        hebrew: {
          50: '#f8f6f1',
          100: '#f0e6d8',
          200: '#e5c4a0',
          500: '#8b5a3c',
          600: '#6b3f24',
          700: '#4a2611',
        },
      },
      fontFamily: {
        hebrew: ['Assistant', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
}
