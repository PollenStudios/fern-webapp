/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xxs: [
        '0.75rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.03125em',
          fontWeight: '400',
        },
      ],
      xs: [
        '0.875rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.03125em',
          fontWeight: '400',
        },
      ],
      base: [
        '1rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.03125em',
          fontWeight: '400',
        },
      ],
      md: [
        '1.125rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.03125em',
          fontWeight: '400',
        },
      ],
      xl: [
        '1.25rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],
      '2xl': [
        '1.5rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],
      '3xl': [
        '2.25rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],
      '4xl': [
        '2.75rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],

      '5xl': [
        '3.25rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],
      '6xl': [
        '3.75rem',
        {
          lineHeight: '1.3',
          letterSpacing: '-0.0625em',
          fontWeight: '600',
        },
      ],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
