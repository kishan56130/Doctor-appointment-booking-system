/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#5F6FFF',
        'secondary': '#4A56E2',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B'
      },
      fontFamily: {
        'sans': ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
