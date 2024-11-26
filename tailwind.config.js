/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite', // Slower, less intense bounce
        'fade-in': 'fadeIn 2s ease-in forwards', // Fade-in effect
        'slideInLeft': 'slideInLeft 1s ease-out', // Slide-in from the left
        'slideInRight': 'slideInRight 1s ease-out', // Slide-in from the right
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-10px)' }, // Reduced amplitude
          '50%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
