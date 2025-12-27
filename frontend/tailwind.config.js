/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Science-inspired color palette
        'space-blue': {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#0A1128', // Deep space blue
        },
        'electric-cyan': {
          50: '#E0FBFF',
          100: '#B3F5FF',
          200: '#80EFFF',
          300: '#4DE9FF',
          400: '#1AE3FF',
          500: '#00D9FF', // Electric cyan
          600: '#00AED9',
          700: '#0082B3',
          800: '#00578C',
          900: '#002C66',
        },
        'neon-green': {
          50: '#F0FFE6',
          100: '#DFFFCC',
          200: '#BFFF99',
          300: '#9FFF66',
          400: '#7FFF33',
          500: '#39FF14', // Neon green
          600: '#2ECC10',
          700: '#23990C',
          800: '#186608',
          900: '#0D3304',
        },
        'fusion-purple': {
          50: '#F5EBFF',
          100: '#EBD6FF',
          200: '#D6ADFF',
          300: '#C285FF',
          400: '#AD5CFF',
          500: '#B24BF3', // Fusion purple
          600: '#8F3CC2',
          700: '#6B2D92',
          800: '#481E61',
          900: '#240F31',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-circuit': 'linear-gradient(135deg, #0A1128 0%, #003D99 100%)',
        'gradient-energy': 'linear-gradient(135deg, #00D9FF 0%, #B24BF3 100%)',
        'gradient-life': 'linear-gradient(135deg, #39FF14 0%, #00D9FF 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00D9FF, 0 0 10px #00D9FF' },
          '100%': { boxShadow: '0 0 10px #00D9FF, 0 0 20px #00D9FF, 0 0 30px #00D9FF' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00D9FF, 0 0 20px #00D9FF',
        'neon-green': '0 0 10px #39FF14, 0 0 20px #39FF14',
        'neon-purple': '0 0 10px #B24BF3, 0 0 20px #B24BF3',
      },
    },
  },
  plugins: [],
}
