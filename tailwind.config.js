/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // Corrected the path to include all relevant file types
  ],
  theme: {
    extend: {
      screens: {
        'custom': '870px',  // Custom screen size added
      },
    },
  },
  plugins: [],
};
