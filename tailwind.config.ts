import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0A0B0D", // page background
          900: "#111318", // card background
          800: "#1B1E25", // raised card / hover
          700: "#282C35", // borders
          600: "#3A3F4B", // muted borders / dividers
        },
        ink: {
          100: "#F4F5F7", // primary text
          300: "#B7BBC5", // secondary text
          500: "#7D8190", // muted text / placeholders
        },
        accent: {
          DEFAULT: "#5EE6C1", // signature mint — sparingly, for score emphasis only
          dim: "#3A8F7B",
        },
        source: {
          imdb: "#F5C518",
          rt: "#FA320A",
          letterboxd: "#00E054",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "20px",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
    },
  },
  plugins: [],
};

export default config;
