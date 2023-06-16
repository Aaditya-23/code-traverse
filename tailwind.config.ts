import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'test-gradient': 'linear-gradient(to bottom right, #36D1DC, #5B86E5)',
        'evaluate-gradient':
          'linear-gradient(to bottom right, #8A2387, #f85b70)',
        'advance-gradient':
          'linear-gradient(to bottom right, #C02425, #F0CB35)',
      },

      fontFamily: {
        kablammo: ['Kablammo', 'cursive'],
      },
      animation: {
        'color-test': 'color-after 6s linear infinite alternate',
        'color-evaluate': 'color-first 6s linear infinite alternate',
        'color-advance': 'color-after 6s linear infinite alternate',
      },
      keyframes: {
        'color-first': {
          '0%': { color: 'transparent' },
          '50%': { color: 'transparent' },
          '100%': { color: 'inherit' },
        },
        'color-after': {
          '0%': { color: 'inherit' },
          '50%': { color: 'transparent' },
          '100%': { color: 'transparent' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
