/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: "#00f3ff",
        hot: "#ff0055",
        dark: "#050505"
      },
      fontFamily: {
        mono: ["Courier New", "monospace"]
      }
    }
  },
  plugins: []
};
