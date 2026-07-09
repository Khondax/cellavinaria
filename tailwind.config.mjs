/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          300: '#f9a8ba',
          500: '#be123c',
          700: '#881337',
          900: '#4c0519',
        },
      },
    },
  },
  plugins: [],
};
