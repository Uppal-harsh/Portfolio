import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0906",
        sand: "#c8a96e",
        dune: "#b58a52",
        gold: "#f5c842"
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "Impact", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"]
      },
      boxShadow: {
        gold: "0 0 50px rgba(245, 200, 66, 0.22)",
        brutal: "0 20px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "radial-halo": "radial-gradient(circle, rgba(245,200,66,0.25), rgba(245,200,66,0.03) 46%, transparent 68%)"
      }
    }
  },
  plugins: []
};

export default config;
