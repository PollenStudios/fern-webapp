/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xxs: '0.75rem',
      xs: '0.875rem',
      base: '1rem',
      md: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2.25rem',
      '4xl': '2.75rem',
      '5xl': '3.25rem',
      '6xl': '3.75rem',
    },
    extend: {
      colors: {
        primary: '#00010E',
        secondary: '#0F9D58',
        tertiary: '#0013FF',
        gray: {
          10: '#E2E2E2',
          20: '#D9D9D9',
          30: '#F8F6F8',
          40: '#808080',
          45: '#F6F6F6',
        },
      },
      letterSpacing: {
        extraTight: '0.0625em',
        tightest: '0.03125em',
      },

      dropShadow: {
        '3xl': '0 2px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
