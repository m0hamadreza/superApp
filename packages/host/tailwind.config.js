/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      // host-specific overrides go here, e.g.:
      // colors: { brand: { DEFAULT: '#0a84ff' } },
    },
  },
  plugins: [],
};
