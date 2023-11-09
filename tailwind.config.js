import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  theme:{
    extend: {
      fontFamily: {
        'oswald':['Oswald', 'sans-serif'],
        'lato':['Lato', 'sans-serif'],
        'air':['Airborne-Pilot', 'sans-serif']
      }
    }
  },
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
};
