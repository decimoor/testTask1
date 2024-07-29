/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f1fffa",
        accent: "#ccfccb",
        hover: "#96e6b3",
      }
    },
  },
  plugins: [],
}

