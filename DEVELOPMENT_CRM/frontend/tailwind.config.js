/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold:      '#F5C800',
          goldDark:  '#E0B200',
          goldLight: '#FFC800',
          goldPale:  '#FFFDE7',
          charcoal:  '#1A1A1A',
          darkGray:  '#2C2C2C',
          medGray:   '#757575',
          lightGray: '#BDBDBD',
          white:     '#FFFFFF',
          bgLight:   '#F5F5F5',
          bgLighter: '#EFEFEF',
          border:    '#E0E0E0',
          statusOpen:      '#1976D2',
          statusAssigned:  '#1976D2',
          statusProgress:  '#00897B',
          statusResolved:  '#388E3C',
          priorityCritical: '#C62828',
          priorityHigh:    '#F57C00',
          priorityMedium:  '#F5C800',
          priorityLow:     '#2E7D32',
          success: '#388E3C',
          warning: '#F57C00',
          danger:  '#C62828',
          info:    '#1976D2',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      keyframes: {
        jiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-6px)' },
          '80%':      { transform: 'translateX(6px)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        jiggle:  'jiggle 0.4s ease-in-out',
        fadeIn:  'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.25s ease-out',
        spin:    'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
};
