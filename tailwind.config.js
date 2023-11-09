/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {},
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    colors: {
      black: {
        DEFAULT: 'rgb(var(--color-black-100) / <alpha-value>)',
      },
      white: {
        DEFAULT: 'rgb(var(--color-white-100) / <alpha-value>)',
      },
      alabaster: {
        DEFAULT: 'rgb(var(--color-alabaster-100) / <alpha-value>)',
      },
      gray: {
        DEFAULT: 'rgb(var(--color-gray-100) / <alpha-value>)',
      },
      gallery: {
        DEFAULT: 'rgb(var(--color-gallery-100) / <alpha-value>)',
      },
      silver: {
        DEFAULT: 'rgb(var(--color-silver-100) / <alpha-value>)',
      },
      wildSand: {
        DEFAULT: 'rgb(var(--color-wildSand-100) / <alpha-value>)',
      },
      bone: {
        DEFAULT: 'rgb(var(--color-bone-100) / <alpha-value>)',
      },
      nandor: {
        DEFAULT: 'rgb(var(--color-nandor-100) / <alpha-value>)',
      },
      casablanca: {
        DEFAULT: 'rgb(var(--color-casablanca-100) / <alpha-value>)',
      },
      gullGray: {
        DEFAULT: 'rgb(var(--color-gullGray-100) / <alpha-value>)',
      },
      envy: {
        DEFAULT: 'rgb(var(--color-envy-100) / <alpha-value>)',
      },
      oldBrick: {
        DEFAULT: 'rgb(var(--color-oldBrick-100) / <alpha-value>)',
      },
      cameo: {
        DEFAULT: 'rgb(var(--color-cameo-100) / <alpha-value>)',
      },
      matrix: {
        DEFAULT: 'rgb(var(--color-matrix-100) / <alpha-value>)',
      },
      outerSpace: {
        DEFAULT: 'rgb(var(--color-outerSpace-100) / <alpha-value>)',
      },
      almond: {
        DEFAULT: 'rgb(var(--color-almond-100) / <alpha-value>)',
      },
      fernFrond: {
        DEFAULT: 'rgb(var(--color-fernFrond-100) / <alpha-value>)',
      },
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      savoyBold: ['savoybold', 'serif'],
      savoyItalic: ['savoyitalic', 'serif'],
      savoyRegular: ['savoyregular', 'serif'],
      savoyRoman: ['savoyroman', 'serif'],
      sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
  variants: {
    display: ['group-hover'],
  },
};
