/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Primary Colors
        'creamy-pink': '#FFE5E7',
        'rose-pink': '#FFB6C1',
        'soft-pink': '#FFC9D0',
        'deep-rose': '#FF9FAD',
        'blush-pink': '#FFF0F2',
        
        // Secondary Colors
        'off-white': '#FFFBFC',
        'cream': '#FFF8F9',
        'soft-gray': '#F8F8F8',
        
        // Text Colors
        'dark-text': '#2D2D2D',
        'gray-text': '#6B6B6B',
        'light-gray': '#9B9B9B',
        
        // Accent Colors
        'success': '#90EE90',
        'warning': '#FFD700',
        'error': '#FFB4B4',
        
        // Semantic Colors
        border: 'hsl(0 0% 94%)',
        input: 'hsl(0 0% 98%)',
        ring: 'hsl(351 100% 86%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(0 0% 18%)',
        primary: {
          DEFAULT: '#FFB6C1',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#FFF0F2',
          foreground: '#2D2D2D',
        },
        destructive: {
          DEFAULT: '#FFB4B4',
          foreground: '#7F1D1D',
        },
        muted: {
          DEFAULT: '#F8F8F8',
          foreground: '#6B6B6B',
        },
        accent: {
          DEFAULT: '#FFE5E7',
          foreground: '#2D2D2D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D2D2D',
        },
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FFFFFF 0%, #FFE5E7 100%)',
        'gradient-rose': 'linear-gradient(135deg, #FFB6C1 0%, #FF9FAD 100%)',
        'gradient-cream': 'linear-gradient(135deg, #FFFBFC 0%, #FFF0F2 100%)',
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(255, 182, 193, 0.2)',
        'soft-lg': '0 10px 30px -5px rgba(255, 182, 193, 0.25)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
