import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "oklch(0.985 0.006 82)",
        stone: "oklch(0.932 0.012 75)",
        linen: "oklch(0.963 0.009 80)",
        charcoal: "oklch(0.205 0.005 80)",
        muted: "oklch(0.45 0.006 80)",
        outline: "oklch(0.78 0.006 80)",
        gold: "oklch(0.62 0.075 78)",
        cobalt: "oklch(0.28 0.12 260)"
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Cinzel", "Playfair Display", "serif"],
        sans: ["Inter", "Noto Sans JP", "system-ui", "sans-serif"],
        label: ["Montserrat", "Inter", "sans-serif"]
      },
      spacing: {
        gutter: "24px",
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        "container-max": "1440px"
      },
      letterSpacing: {
        luxury: "0.22em",
        label: "0.32em"
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      boxShadow: {
        material: "0 24px 80px rgb(26 26 26 / 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
