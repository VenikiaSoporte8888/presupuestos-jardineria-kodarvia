/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Verde bosque: encabezado, texto y botones principales.
        ink: {
          50: '#EEF7EA',
          100: '#DCEED4',
          200: '#BFE3AE',
          500: '#4E8B45',
          600: '#3B6E3A',
          700: '#2D5A33',
          800: '#166534',
          900: '#0F2D1C',
        },
        // Crema cálida: fondos y bordes.
        sand: {
          50: '#FAF8EF',
          100: '#F1EEDD',
          200: '#E2DDC4',
        },
        // Terracota (maceta): botones de acento e iconos de contraste.
        clay: {
          100: '#FBE3D3',
          500: '#D9622B',
          600: '#C2410C',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,45,28,.06), 0 6px 16px -10px rgba(15,45,28,.16)',
        bar: '0 -6px 20px -12px rgba(15,45,28,.35)',
      },
    },
  },
  plugins: [],
}
