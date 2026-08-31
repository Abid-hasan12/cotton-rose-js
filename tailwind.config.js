/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F2D52",
          gold: "#C9A24B",
          ink: "#2B2B2B",
          mist: "#F4F6F8",
        },
      },
      boxShadow: {
        "product-card": "0 18px 50px rgba(15, 45, 82, 0.10)",
        "product-card-hover": "0 24px 64px rgba(15, 45, 82, 0.17)",
      },
    },
  },
  plugins: [],
};
