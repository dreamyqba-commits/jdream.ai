import type { Config } from "tailwindcss";
import {
  colors,
  fontFamily,
  fontSize,
  spacing,
  borderRadius,
  duration,
  easing,
} from "./brand.config";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS-variable-backed tokens — resolved at runtime from globals.css
        background: "var(--color-background)",
        elevated: "var(--color-elevated)",
        surface: "var(--color-surface)",
        foreground: "var(--color-foreground)",
        secondary: "var(--color-secondary)",
        muted: "var(--color-muted)",
        placeholder: "var(--color-placeholder)",
        disabled: "var(--color-disabled)",
        hairline: "var(--color-hairline)",
        separator: "var(--color-separator)",
        brand: "var(--color-brand)",
        "brand-hover": "var(--color-brand-hover)",
        "brand-pressed": "var(--color-brand-pressed)",
        "brand-subtle": "var(--color-brand-subtle)",
        success: "var(--color-success)",
        "success-subtle": "var(--color-success-subtle)",
        warning: "var(--color-warning)",
        "warning-subtle": "var(--color-warning-subtle)",
        danger: "var(--color-danger)",
        "danger-subtle": "var(--color-danger-subtle)",

        // Static palette (for rare cases where theme-switching isn't needed)
        "brand-static": colors.light.brand,
        "dark-bg": colors.dark.background,
      },

      fontFamily: {
        sans: fontFamily.primary.split(", "),
        mono: fontFamily.mono.split(", "),
      },

      fontSize: fontSize as Config["theme"] extends { fontSize: infer F } ? F : never,

      spacing,

      borderRadius: {
        ...borderRadius,
        DEFAULT: borderRadius.md,
      },

      transitionDuration: {
        instant: duration.instant,
        fast: duration.fast,
        normal: duration.normal,
        slow: duration.slow,
        enter: duration.enter,
        exit: duration.exit,
      },

      transitionTimingFunction: {
        standard: easing.standard,
        decelerate: easing.decelerate,
        accelerate: easing.accelerate,
        spring: easing.spring,
      },

      // No shadows — hierarchy via elevated background + hairline only
      boxShadow: {
        // Modal/drawer exceptions only
        modal: "0 20px 60px 0 rgba(0,0,0,0.18)",
        drawer: "0 8px 32px 0 rgba(0,0,0,0.12)",
      },

      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
