/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          900: '#1A120B',
          800: '#231710',
          700: '#3A271C',
          600: '#523828',
        },
        terracotta: {
          DEFAULT: '#C85A32',
          hover: '#B54D27',
          light: '#FDF2ED',
        },
        matcha: {
          DEFAULT: '#3B6E4C',
          light: '#EAF4ED',
          border: '#A8D5B5',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FBF8F4',
          200: '#F5EFEB',
          300: '#EAE3D8',
        },
        warmgray: {
          800: '#1E1B18',
          600: '#635C54',
          400: '#968E85',
          200: '#E3DDD5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Sarabun', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
