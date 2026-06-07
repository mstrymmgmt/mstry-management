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
          black: "#0A0A0A",
          charcoal: "#111827",
          panel: "#111827",
          gold: "#D4AF37",
          deepGold: "#8E681F",
          silver: "#FFFFFF",
          muted: "#B8B8B8"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
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
