/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0A',
        char: '#141311',
        surface: '#181714',
        surface2: '#1D1B17',
        gold: {
          DEFAULT: '#C6A15B',
          light: '#D8BD7A',
          dim: 'rgba(198,161,91,0.20)',
        },
        ivory: '#F3EFE6',
        stone: '#A9A39A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        sans: ['Poppins', 'Manrope', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ultra-luxe': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '700': '700ms',
        '900': '900ms',
        '1200': '1200ms',
      },
      boxShadow: {
        deep: '0 30px 60px -20px rgba(0,0,0,0.65)',
        card: '0 20px 40px -18px rgba(0,0,0,0.55)',
        'card-hover': '0 28px 50px -14px rgba(0,0,0,0.65), 0 0 30px -6px rgba(198,161,91,0.08)',
        'glow-gold': '0 0 24px rgba(198,161,91,0.12), 0 0 60px rgba(198,161,91,0.04)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'golden-border-trace': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        'ripple-expand': {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '60%': { opacity: '0.2' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'light-sweep-h': {
          '0%': { transform: 'translateX(-120%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(198,161,91,0.15)' },
          '50%': { boxShadow: '0 0 24px rgba(198,161,91,0.45), 0 0 48px rgba(198,161,91,0.12)' },
        },
        'waveform-drift': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'flip-in': {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        'compass-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'border-glow-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s ease-in-out',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gentle-float': 'gentle-float 6s ease-in-out infinite',
        'golden-trace': 'golden-border-trace 3s linear infinite',
        'ripple': 'ripple-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'light-sweep': 'light-sweep-h 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'waveform': 'waveform-drift 8s linear infinite',
        'flip-in': 'flip-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'compass-spin': 'compass-spin 20s linear infinite',
        'border-glow': 'border-glow-pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
