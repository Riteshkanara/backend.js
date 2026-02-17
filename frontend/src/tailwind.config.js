/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#242424',
        },
        primary: {
          DEFAULT: '#FF0000',
          light: '#FF4444',
          dark: '#CC0000',
        },
        accent: {
          blue: '#3EA6FF',
          purple: '#9147FF',
          green: '#00D95F',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF0000 0%, #FF4444 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A1A 0%, #242424 100%)',
        'gradient-overlay': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(255, 0, 0, 0.5)',
        'glow-lg': '0 0 30px rgba(255, 0, 0, 0.7)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}