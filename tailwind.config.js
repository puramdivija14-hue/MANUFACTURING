/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#060c18',
          900: '#0b1329',
          850: '#101c38',
          800: '#172554',
          700: '#1e3a8a',
          600: '#2563eb',
          accent: '#10b981', // emerald
          teal: '#14b8a6',
          amber: '#f59e0b',
          cyan: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
