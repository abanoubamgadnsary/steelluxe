/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF5',
          100: '#FAF5EB',
          200: '#F5EDD8',
          300: '#EDE0C4',
        },
        gold: {
          100: '#F5E6C8',
          200: '#EDD49A',
          300: '#D4AF6C',
          400: '#C49A4E',
          500: '#B8860B',
          600: '#9A6F0A',
        },
        charcoal: {
          50:  '#F4F3F1',
          100: '#E8E6E1',
          200: '#C5C1B8',
          400: '#8C8780',
          600: '#4A4540',
          700: '#2E2B26',
          800: '#1C1A17',
          900: '#0F0E0C',
        },
        blush: {
          100: '#F9EEE9',
          200: '#F0D9D0',
          300: '#E2BFB4',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.4s ease forwards',
        'slide-left':  'slideLeft 0.5s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
        'shimmer':     'shimmer 1.5s infinite linear',
        'float':       'float 3s ease-in-out infinite',
        'marquee':     'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideRight:{ from: { opacity: 0, transform: 'translateX(-24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        marquee:   { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      boxShadow: {
        'soft':   '0 2px 20px rgba(184,134,11,0.08)',
        'gold':   '0 4px 24px rgba(184,134,11,0.20)',
        'card':   '0 1px 3px rgba(15,14,12,0.06), 0 8px 24px rgba(15,14,12,0.04)',
        'hover':  '0 8px 40px rgba(15,14,12,0.12)',
        'inner-gold': 'inset 0 1px 0 rgba(184,134,11,0.3)',
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #D4AF6C 0%, #B8860B 50%, #9A6F0A 100%)',
        'cream-gradient':  'linear-gradient(180deg, #FDFAF5 0%, #FAF5EB 100%)',
        'hero-gradient':   'linear-gradient(135deg, #0F0E0C 0%, #1C1A17 40%, #2E2B26 100%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent 0%, rgba(212,175,108,0.15) 50%, transparent 100%)',
        'radial-gold':     'radial-gradient(ellipse at center, rgba(212,175,108,0.15) 0%, transparent 70%)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
