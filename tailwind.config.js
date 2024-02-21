/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
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
  plugins: [
    require('tailwind-highlightjs'),
    require('flowbite/plugin'),
  ]
}