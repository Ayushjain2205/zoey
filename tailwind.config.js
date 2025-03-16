/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['SpaceGrotesk_400Regular', 'sans-serif'],
        'heading': ['RubikDoodleShadow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
