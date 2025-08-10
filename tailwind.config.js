module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 50:"#eff6ff", 600:"#2563eb", 700:"#1d4ed8" } },
      boxShadow: { soft: "0 10px 30px -12px rgba(0,0,0,.12)" }
    }
  },
  plugins: []
};
