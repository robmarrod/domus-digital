import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ─── Teal/Ciano principal #00B4C8 ────────────────────────────────
        brand: {
          50:  "#F0FAFB",
          100: "#E0F7FA",   // fundo teal claro
          200: "#B2EBF2",
          300: "#80DEEA",
          400: "#26C6DA",
          500: "#00B4C8",   // teal principal — CTA principal
          600: "#009AAE",   // teal escuro — hover / links
          700: "#00838F",
          800: "#006064",   // teal muito escuro — rodapé / top bar
          900: "#004D55",
          950: "#003840",
        },

        // ─── Accent vermelho #E84444 ──────────────────────────────────────
        teal: {
          50:  "#FEF2F2",
          100: "#FDE8E8",
          200: "#FCCACA",
          300: "#F99B9B",
          400: "#F46E6E",
          500: "#E84444",
          600: "#E84444",   // vermelho "DOMUS" — accent
          700: "#C53030",
        },

        // ─── Bege / Nude ─────────────────────────────────────────────────
        nude: {
          50:  "#fefcf9",
          100: "#fdf8f0",   // card bg
          200: "#f9f5ec",   // fundo principal (body)
          300: "#f4ebde",   // bege mais intenso
          400: "#e0dacb",   // bordas suaves
          500: "#c8bfae",
          600: "#a8997e",
          700: "#8a7a5e",
        },

        // ─── Café / Texto ─────────────────────────────────────────────────
        cafe: {
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",   // meta / caption
          500: "#6b7280",   // texto secundário
          600: "#4b5563",
          700: "#374151",
          800: "#1f2933",   // texto principal
          900: "#111827",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        // font-sans  → Inter (corpo)
        // font-serif → Poppins (títulos — mantém compatibilidade com todas as classes existentes)
        sans:  ["var(--font-body)",    "Inter",   "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "Poppins", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "slide-down":     "slide-down 0.2s ease-out",
      },
      boxShadow: {
        "brand-sm": "0 2px 8px 0 rgba(0, 180, 200, 0.15)",
        "brand-md": "0 4px 16px 0 rgba(0, 180, 200, 0.20)",
        "brand-lg": "0 8px 32px 0 rgba(0, 180, 200, 0.28)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
