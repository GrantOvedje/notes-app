/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //colors used in the project
      colors: {
        primary: "#2845ff",
        secondary: "#EF863t",
      }
    },
  },
  plugins: [],
}

