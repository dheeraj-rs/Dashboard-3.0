/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        enter: 'enter 0.3s ease-out',
        leave: 'leave 0.2s ease-in forwards',
        progress: 'progress 4s linear forwards',
        'slide-up-fade': 'slide-up-fade 0.3s ease-out',
        'slide-down-fade': 'slide-down-fade 0.2s ease-in forwards',
        'progress-reverse': 'progress-reverse 4s linear forwards',
        'toast-enter': 'toast-enter 0.4s cubic-bezier(0.21, 1.02, 0.73, 1)',
        'toast-leave': 'toast-leave 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards',
        'modal-enter': 'modal-enter 0.2s ease-out',
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
        enter: {
          '0%': { 
            transform: 'translate3d(100%, 0, 0) scale(.8)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translate3d(0, 0, 0) scale(1)', 
            opacity: 1 
          },
        },
        leave: {
          '0%': { 
            transform: 'translate3d(0, 0, 0) scale(1)', 
            opacity: 1 
          },
          '100%': { 
            transform: 'translate3d(100%, 0, 0) scale(.8)', 
            opacity: 0 
          },
        },
        progress: {
          '0%': { 
            transform: 'scaleX(1)' 
          },
          '100%': { 
            transform: 'scaleX(0)' 
          },
        },
        'slide-up-fade': {
          '0%': { 
            transform: 'translateY(16px) scale(0.96)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: 1 
          },
        },
        'slide-down-fade': {
          '0%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(16px) scale(0.96)', 
            opacity: 0 
          },
        },
        'progress-reverse': {
          '0%': { 
            transform: 'scaleX(0)' 
          },
          '100%': { 
            transform: 'scaleX(1)' 
          },
        },
        'toast-enter': {
          '0%': { 
            transform: 'translate3d(0, 24px, -64px) scale(0.9) rotateX(8deg)',
            opacity: 0 
          },
          '100%': { 
            transform: 'translate3d(0, 0, 0) scale(1) rotateX(0)',
            opacity: 1 
          }
        },
        'toast-leave': {
          '0%': { 
            transform: 'translate3d(0, 0, 0) scale(1) rotateX(0)',
            opacity: 1 
          },
          '100%': { 
            transform: 'translate3d(0, 24px, -64px) scale(0.9) rotateX(8deg)',
            opacity: 0 
          }
        },
        'modal-enter': {
          '0%': { transform: 'scale(0.95) translate(0, 2rem)', opacity: 0 },
          '100%': { transform: 'scale(1) translate(0, 0)', opacity: 1 },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
};
