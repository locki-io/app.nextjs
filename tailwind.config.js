/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [{
    pattern: /hljs+/,
  }],
  theme: {
    hljs: {
      theme: 'night-owl',
    },
    extend: {
      backgroundImage: {
        'code': "url('/assets/img/code.png')",
        'description': "url('/assets/img/description.png')",
        'profile':"url('/assets/img/profile.png')",
      }, 
    }, 
  }, 
  plugins: []
}