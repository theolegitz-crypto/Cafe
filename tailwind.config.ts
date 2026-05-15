import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f7fb',
        surface: '#ffffff',
        muted: '#eef2f7',
        line: '#dde5ef',
        ink: '#152033',
        slate: '#5f6f86',
        accent: '#ff7a59',
        accentSoft: '#ffe7df',
        accentDeep: '#e85d3b',
        mint: '#dff7f0',
        brand: {
          50: '#f6f8fc',
          100: '#edf2f8',
          200: '#dde5ef',
          300: '#c4d0df',
          400: '#9caec5',
          500: '#7688a1',
          600: '#5f6f86',
          700: '#48576d',
          800: '#2d3b4f',
          900: '#152033',
        },
      },
      boxShadow: {
        soft: '0 12px 30px -18px rgba(21, 32, 51, 0.14)',
        card: '0 18px 40px -24px rgba(21, 32, 51, 0.14)',
        float: '0 28px 60px -34px rgba(21, 32, 51, 0.18)',
      },
      fontFamily: {
        sans: ['Manrope', '"Segoe UI"', 'sans-serif'],
        display: ['"Space Grotesk"', 'Manrope', 'sans-serif'],
      },
      backgroundImage: {
        glow:
          'radial-gradient(circle at top left, rgba(255,122,89,0.12), transparent 28%), radial-gradient(circle at top right, rgba(89,187,255,0.10), transparent 24%), radial-gradient(circle at bottom center, rgba(98,214,180,0.10), transparent 28%)',
      },
      keyframes: {
        rise: {
          '0%': {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        rise: 'rise 600ms ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
