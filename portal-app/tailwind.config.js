/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        'input-shadow': '0 63px 59px rgba(26,33,188,.1)',
        'course-shadow': '0 40px 20px rgba(0,0,0,.15)',
        'testimonial-shadow1': '0 5.54348px 11.087px rgba(89,104,118,.05)',
        'testimonial-shadow2': '5.54348px 38.8043px 110.87px rgba(89,104,118,.15)',
      },
      colors: {
        primary: '#6556ff',
        secondary: '#1a21bc',
        success: '#43c639',
        slateGray: '#f8fafc',
        midnight_text: '#0f172a',
        grey: '#64748b'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}

