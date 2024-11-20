/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens:{
      'sm': '640px',
      // => @media (min-width: 640px) { ... } // Small devices (phones)

      'md': '768px',
      // => @media (min-width: 768px) { ... } // Medium devices (tablets)

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... } // Large devices (laptops)

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... } // Extra large devices (desktops)

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... } // Extra extra large devices (large desktops)

    },
    extend: {
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite', // Slower, less intense bounce
        'fade-in': 'fadeIn 2s ease-in forwards', // Fade-in effect
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
      },
    },
  },
  plugins: [],
}