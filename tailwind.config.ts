import type {Config} from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        foreground: 'var(--foreground-color)',
        background: 'var(--background-color)',
      },
      keyframes: {
        growwidth: {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%',
          },
        },
        glow: {
          '0%,100%': {
            textShadow: '0px 0px 35px cyan',
          },
          '50%': {
            textShadow: '0px 0px 25px cyan',
          },
        },
        flicker: {
          '0%': {
            opacity: '0',
          },
          '1.5': {
            opacity: '0',
          },
          '2%': {
            opacity: '1',
          },
          '2.1%': {
            opacity: '.2',
          },
          '4%': {
            opacity: '1',
          },
          '8%': {
            opacity: '1',
          },
          '8.1%': {
            opacity: '.2',
          },
          '10%': {
            opacity: '.2',
          },
          '20%': {
            opacity: '.8',
          },
          '20.1%': {
            opacity: '.2',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadein: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        flicker: 'flicker 5s  ',
        growwidth: 'growwidth 1.5s ease-in',
        fadein: 'fadein .333s ease-in',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
    },
  },
  plugins: [
    plugin(function ({addUtilities, matchUtilities}) {
      addUtilities({
        '.animate-forwards': {
          animationFillMode: 'forwards',
        },
      });
      matchUtilities({
        'animation-delay': (value) => ({
          animationDelay: value,
        }),
      });
    }),
  ],
} satisfies Config;
