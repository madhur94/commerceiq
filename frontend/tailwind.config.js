/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#070A13',
          deep: '#04060B',
        },
        surface: {
          DEFAULT: '#111827',
          elevated: '#162032',
          subtle: '#0D131F',
          card: '#111827',
        },
        brand: {
          violet: '#8B5CF6',
          'violet-light': '#A78BFA',
          'violet-dark': '#7C3AED',
          cyan: '#22D3EE',
          'cyan-bright': '#06B6D4',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          indigo: '#6366F1',
        },
        text: {
          primary: '#F1F5F9',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      borderColor: {
        hairline: 'rgba(255, 255, 255, 0.08)',
        prominent: 'rgba(255, 255, 255, 0.14)',
        violet: 'rgba(139, 92, 246, 0.35)',
        cyan: 'rgba(34, 211, 238, 0.35)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 15px -2px rgba(139, 92, 246, 0.15)',
        glow: '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px -5px rgba(34, 211, 238, 0.3)',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
    },
  },
  plugins: [],
};
