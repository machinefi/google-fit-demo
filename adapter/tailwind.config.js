/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        mono: [
          "Cascadia Mono",
          "Segoe UI Mono",
          "Roboto Mono",
          "Oxygen Mono",
          "Ubuntu Monospace",
          "Source Code Pro",
          "Fira Mono",
          "Droid Sans Mono",
          "Courier New",
        ],
      },
      colors: {
        primary: {
          50: "#E5FDFF",
          100: "#B8F8FF",
          200: "#8AF4FF",
          300: "#5CEFFF",
          400: "#2EEBFF",
          500: "#00E6FF",
          600: "#00B8CC",
          700: "#008A99",
          800: "#005C66",
          900: "#002E33",
        },
        secondary: colors.gray,
        neutral: colors.zinc,
      },
    },
  },
  plugins: [],
};
