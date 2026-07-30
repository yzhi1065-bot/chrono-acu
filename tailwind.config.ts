import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vermilion: { DEFAULT: '#8B0000', light: '#B22222', dark: '#5C0000' },
        gold: { DEFAULT: '#C9A96E', light: '#D4AF37', dark: '#A08040' },
        ink: { DEFAULT: '#1A1A2E', light: '#2D2D44', dark: '#0F0F1A' },
        parchment: { DEFAULT: '#F5E6C8', dark: '#E0CDA8' },
        jade: { DEFAULT: '#2E8B57', light: '#3CB371' },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
