import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f7fb',
        surface: '#ffffff',
        muted: '#eef3f9',
        line: '#d9e2ef',
        ink: '#142033',
        slate: '#5f7189',
        accent: '#ff7a59',
        accentSoft: '#ffe7df',
        accentDeep: '#ef5d36',
        mint: '#dff7ef',
        success: '#23b07d',
        successSoft: '#dcfaef',
        brand: {
          50: '#f7f9fc',
          100: '#edf2f8',
          200: '#d9e2ef',
          300: '#c2cfdf',
          400: '#9fb2c8',
          500: '#7d90a6',
          600: '#5f7189',
          700: '#43536a',
          800: '#2b394d',
          900: '#142033',
        },
      },
      boxShadow: {
        soft: '0 12px 34px -22px rgba(20, 32, 51, 0.18)',
        card: '0 20px 50px -30px rgba(20, 32, 51, 0.18)',
        float: '0 30px 70px -38px rgba(20, 32, 51, 0.24)',
      },
      fontFamily: {
        sans: ['Manrope', '"Segoe UI"', 'sans-serif'],
        display: ['"Space Grotesk"', 'Manrope', 'sans-serif'],
      },
      backgroundImage: {
        glow:
          'radial-gradient(circle at top left, rgba(255,122,89,0.16), transparent 30%), radial-gradient(circle at top right, rgba(89,187,255,0.14), transparent 26%), radial-gradient(circle at bottom center, rgba(98,214,180,0.12), transparent 30%)',
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
        rise: 'rise 500ms ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
