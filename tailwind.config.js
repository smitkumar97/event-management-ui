/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Roboto", "sans-serif"],
      },
      colors: {
        "gradient-start": "#F637E3",
        "gradient-end": "#8514F5",
      },
      backgroundImage: {
        "gradient-custom": "linear-gradient(to right, #F637E3, #8514F5)",
      },
    },
  },
};
