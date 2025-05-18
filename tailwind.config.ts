
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        neon: '#BEEA9E',
        'neon-glow': 'rgba(190, 234, 158, 0.5)',
        'neon-dim': 'rgba(190, 234, 158, 0.2)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(190, 234, 158, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(190, 234, 158, 0.8)' }
        },
        'radar-scan': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(3)', opacity: '0' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px)' },
          '40%': { transform: 'translate(-5px, -5px)' },
          '60%': { transform: 'translate(5px, 5px)' },
          '80%': { transform: 'translate(5px, -5px)' }
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'cursor-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' }
        },
        'number-change': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'radar-scan': 'radar-scan 2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'draw-line': 'draw-line 2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.5s ease-in-out',
        'scan-line': 'scan-line 2s linear infinite',
        'cursor-pulse': 'cursor-pulse 1s ease-in-out infinite',
        'number-change': 'number-change 0.5s ease-out forwards'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
