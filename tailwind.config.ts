import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "#10b981", // Emerald accent
          foreground: "#022c22",
          hover: "#059669",
        },
        secondary: {
          DEFAULT: "#06b6d4", // Cyan accent
          foreground: "#083344",
        },
        eth: {
          dark: "#0b0f19",
          slate: "#111827",
          card: "#182234",
          border: "#26354a",
          purple: "#6366f1",
          cyan: "#38bdf8",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#f43f5e"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(52, 211, 153, 0.4))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(52, 211, 153, 0.2))" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
