import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/config/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mstry: {
          black: "#050505",
          charcoal: "#0d0d0e",
          panel: "#141414",
          gold: "#d6ad55",
          deepGold: "#8e681f",
          silver: "#d8d8d8",
          muted: "#b8b2a8"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        luxury: "0 24px 70px rgba(0, 0, 0, .42)"
      },
      borderRadius: {
        mstry: "8px"
      }
    }
  },
  plugins: []
};

export default config;
