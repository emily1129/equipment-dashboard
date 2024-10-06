/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-light':
          'linear-gradient(135deg, var(--light-gradient-from) 0%, var(--light-gradient-to) 100%)',
        'gradient-dark':
          'linear-gradient(135deg, var(--dark-gradient-from) 0%, var(--dark-gradient-to) 100%)'
      }
    }
  },
  plugins: []
}
