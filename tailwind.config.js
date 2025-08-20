/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3f51b5",
          light: "#6573c3",
          dark: "#2c387e",
        },
        secondary: {
          DEFAULT: "#f50057",
          light: "#f73378",
          dark: "#ab003c",
        },
        surface: "#ffffff",
        background: "#f5f5f5",
        border: "#e0e0e0",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      }
    },
  },
  plugins: [],
}
