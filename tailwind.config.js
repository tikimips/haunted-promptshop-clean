/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 900: "#0e0f12" },
        spectral: { 500: "#6f63ff" }
      },
      borderRadius: { "xl2": "1rem" }
    }
  },
  plugins: []
};
