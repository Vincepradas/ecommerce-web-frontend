module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['"Bubblegum Sans"', 'cursive'],
        fuzzy: ["Fuzzy Bubbles", 'sans-serif',],
        poppins: ["Poppins", 'serif'],
        lato: ["Lato", 'sans-serif'],
        slick: ["Space Grotesk", 'sans-serif']
      },
      fontWeight: {
        regular: 400, // Normal weight
        bold: 700,    // Bold weight
        black: 900,   // Extra heavy
      },
    },
  },
  plugins: []
};
