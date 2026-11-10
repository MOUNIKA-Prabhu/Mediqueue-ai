import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          green: "#16a34a",
          yellow: "#eab308",
          blueDark: "#1e3a8a",
        },
      },
      fontSize: {
        "kiosk-sm": "1.125rem",
        "kiosk-base": "1.375rem",
        "kiosk-lg": "1.75rem",
        "kiosk-xl": "2.5rem",
        "kiosk-2xl": "3.5rem",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.15)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.15)" },
          "70%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        heartbeatScroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "heartbeat-scroll": "heartbeatScroll 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
