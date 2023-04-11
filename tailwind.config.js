/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      kalam: ["Kalam", "cursive"],
    },
    extend: {},
  }, 
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake"],
  },
}
