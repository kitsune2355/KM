const { themeColors } = require('./src/config/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...themeColors
      },
      screens: {
        sm: "640px", // Small devices (phones)
        md: "768px", // Medium devices (tablets)
        lg: "1024px", // Large devices (desktops)
        xl: "1280px", // Extra large devices (large desktops)
        "2xl": "1536px", // 2X extra large devices
      },
      backgroundSize: {
        "200%": "200% 100%",
      },
      backgroundImage: {
        "gradient-linear": "linear-gradient(to right, #029488, #134E4A)",
        "gradient-radial": "radial-gradient(circle, #364d79, #1F2937)",
        "slide-gradient":
          "linear-gradient(to right, #bddfdd 0%, #fff 50%, #bddfdd 100%)",
      },
      keyframes: {
        "slide-colors": {
          "0%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      animation: {
        "slide-colors": "slide-colors 1.5s ease-in-out forwards",
      },
    },
    plugins: [],
  },
};
