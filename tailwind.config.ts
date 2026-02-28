import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        main: '#00298d',
        secondary: '#f0f2f5',
      },
      fontFamily: {
        sans: ["'SN Pro'", 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
} satisfies Config;
