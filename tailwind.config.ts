import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beyanco: {
          // Architectural editorial palette
          ivory: "#F6F4EF",
          "ivory-light": "#FAF8F5",
          "ivory-dark": "#ECE8DF",
          ink: "#101827",
          "ink-light": "#1E293B",
          "ink-muted": "#334155",
          stone: "#D8D5CF",
          "stone-light": "#EAE8E3",
          slate: "#626A75",
          "slate-light": "#8E97A4",
          bronze: "#A98460",
          "bronze-light": "#C4A482",
          "bronze-dark": "#8C6A48",
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-subtle": "#EFF6FF",

          // Backward compatibility for existing app pages
          bg: "#F8FAFC",
          card: "#FFFFFF",
          navy: "#0F172A",
          muted: "#94A3B8",
          border: "#E2E8F0",
          blueHover: "#1D4ED8",
          violet: "#7C3AED",
          paleBlue: "#EFF6FF",
          emerald: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          darkNavy: "#0B1120",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Playfair Display",
          "Newsreader",
          "Georgia",
          "Cambria",
          "serif",
        ],
      },
      boxShadow: {
        architectural: "0 20px 40px -15px rgba(16, 24, 39, 0.08)",
        "architectural-lg": "0 30px 60px -12px rgba(16, 24, 39, 0.14)",
        subtle: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        card: "0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        cardHover: "0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -4px rgba(15, 23, 42, 0.04)",
        elevated: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        card: "18px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
