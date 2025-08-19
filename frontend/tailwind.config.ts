import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Ultra: ["Ultra", "serif"],
        gilroy: ["var(--font-gilroy)"],
        gilroyBold: ["var(--font-gilroyBold)"],
        gilroyLight: ["var(--font-gilroyLight)"],
        martianmono: ["var(--font-martianmono)"],
        BricolageGrotesque:["var(--font-BricolageGrotesque)"],
      },
      animation: {
        "spin-conic": "spin-conic 3s linear infinite",
        "shake": "shake 0.5s ease-in-out infinite",
      },
      keyframes: {
        "spin-conic": {
          to: {
            "--angle": "360deg",
          },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
