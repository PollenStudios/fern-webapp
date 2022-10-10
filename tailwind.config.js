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
        blue: {
          10: '#0013FF',
        },
        black: {
          10: '#00010E',
        },
        green: {
          10: '#0F9D58',
        },
      },
      lineHeight: {
        'extra-loose': '1.3',
      },
      letterSpacing: {
        extraTight: '0.0625em',
        tightest: '0.03125em',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
