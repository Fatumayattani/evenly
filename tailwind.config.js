/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ff',
          100: '#fde9ff',
          200: '#fcd4fe',
          300: '#fab0fc',
          400: '#f67df7',
          500: '#ec4eed',
          600: '#d92dd0',
          700: '#b71faa',
          800: '#981d8a',
          900: '#7d1c6f',
        },
        accent: {
          50: '#fffbeb',
          100: '#fff4c6',
          200: '#ffe788',
          300: '#ffd64a',
          400: '#ffc220',
          500: '#f99d07',
          600: '#dd7302',
          700: '#b74e06',
          800: '#943c0c',
          900: '#7a310d',
        },
      },
    },
  },
  plugins: [],
};
