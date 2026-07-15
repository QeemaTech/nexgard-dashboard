/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a"
        },
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)"
        }
      },
      fontFamily: {
        sans: ["Alexandria", "system-ui", "sans-serif"],
        display: ["Alexandria", "system-ui", "sans-serif"],
        body: ["Alexandria", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "blue-soft": "0 10px 15px -3px rgb(59 130 246 / 0.1)"
      }
    }
  },
  plugins: []
};
