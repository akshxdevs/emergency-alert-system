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
        Ultra: ['Ultra', 'serif'], // 👈 define your font
      },
      animation: {
        'spin-conic': 'spin-conic 3s linear infinite',
      },
      keyframes: {
        'spin-conic': {
          to: {
            '--angle': '360deg',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
