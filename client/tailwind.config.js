/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#2e1065",
        light_white: "rgba(255,255,255,0.18)",
      },
    },
  },
  plugins: [],
};
