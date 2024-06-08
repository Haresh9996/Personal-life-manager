/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff', // Light background color
          text: '#000000',       // Light text color
          primary: '#1DA1F2',    // Light primary color
          // Add more colors as needed
        },
        dark: {
          background: '#1a202c', // Dark background color
          text: '#f7fafc',       // Dark text color
          primary: '#1DA1F2',    // Dark primary color
          // Add more colors as needed
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
};
