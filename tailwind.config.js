/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(var(--foreground))',
        background: 'rgb(var(--background))',
        primary: 'rgb(var(--primary))',
        secondary: 'rgb(var(--secondary))',
      },
    },
  },
  plugins: [],
} 