/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {},
    colors: {
      bone: {
        DEFAULT: 'rgb(var(--color-bone-100) / <alpha-value>)',
      },
      black: {
        DEFAULT: 'rgb(var(--color-black-100) / <alpha-value>)',
      },
      white: {
        DEFAULT: 'rgb(var(--color-white-100) / <alpha-value>)',
      },
    },
    fontFamily: {
      serif: ['Savoy', 'serif'],
    },
  },
  plugins: [],
};
