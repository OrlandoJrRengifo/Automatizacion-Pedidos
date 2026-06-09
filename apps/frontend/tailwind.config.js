export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon:  '#141414',
        surface: '#1C1C1C',
        panel:   '#242424',
        border:  '#2E2E2E',
        accent:  '#E8FF47',
        muted:   '#6B6B6B',
        pending: '#F59E0B',
        approved:'#4ADE80',
        rejected:'#F87171',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}