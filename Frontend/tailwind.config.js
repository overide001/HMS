/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: 'Poppins, sans-serif',
        sans: 'Poppins, sans-serif',
        heading: 'Merriweather, serif',
      },
      colors: {
        primary: {
          100: '#fef2f2',
          200: '#ffe1e1',
          300: '#ffc9c9',
          400: '#fea3a3',
          500: '#fa5c5c',
          600: '#f24141',
          700: '#df2323',
          800: '#bc1919',
          900: '#9b1919',
        },
        neutral: {
          100: '#ffffff',
          200: '#f7f7f7',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#cfcfcf',
          600: '#a8a8a8',
          700: '#7a7a7a',
          800: '#555555',
          900: '#1E1E1E',
        },
      }
    }
  },
  plugins: [],
}