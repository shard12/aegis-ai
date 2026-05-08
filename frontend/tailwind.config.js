/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aegis: {
          teal: '#0d9488',
          tealDark: '#0f766e',
          ink: '#0f172a',
          mist: '#f1f5f9',
          alert: '#dc2626',
          warn: '#d97706',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
