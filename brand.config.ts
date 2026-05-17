/**
 * Jdream.ai brand tokens — single source of truth for design system.
 * Import this in tailwind.config.ts and reference in app/globals.css.
 * Never hardcode hex values in component files — always use tokens.
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const colors = {
  light: {
    // Backgrounds
    background: "#FFFFFF",
    elevated: "#F5F5F7",
    surface: "#FAFAFA",
    overlay: "#00000066",

    // Borders
    hairline: "#E5E5EA",
    separator: "#D2D2D7",

    // Text
    foreground: "#1D1D1F",
    secondary: "#6E6E73",
    muted: "#86868B",
    placeholder: "#AEAEB2",
    disabled: "#C7C7CC",

    // Brand
    brand: "#0071E3",
    brandHover: "#0077ED",
    brandPressed: "#006EDB",
    brandSubtle: "#0071E314",

    // Semantic
    success: "#34C759",
    successSubtle: "#34C75920",
    warning: "#FF9500",
    warningSubtle: "#FF950020",
    danger: "#FF3B30",
    dangerSubtle: "#FF3B3020",
  },
  dark: {
    // Backgrounds
    background: "#000000",
    elevated: "#1C1C1E",
    surface: "#2C2C2E",
    overlay: "#00000099",

    // Borders
    hairline: "#38383A",
    separator: "#48484A",

    // Text
    foreground: "#F5F5F7",
    secondary: "#EBEBF5CC",
    muted: "#EBEBF599",
    placeholder: "#EBEBF54D",
    disabled: "#EBEBF52E",

    // Brand
    brand: "#0A84FF",
    brandHover: "#409CFF",
    brandPressed: "#0071E3",
    brandSubtle: "#0A84FF1A",

    // Semantic
    success: "#30D158",
    successSubtle: "#30D15820",
    warning: "#FF9F0A",
    warningSubtle: "#FF9F0A20",
    danger: "#FF453A",
    dangerSubtle: "#FF453A20",
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fontFamily = {
  // Primary UI — system font stack (zero license cost)
  primary:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", system-ui, Roboto, sans-serif',
  // Monospace accent — credits, model IDs, timestamps, price decimals, prompt labels
  mono: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", Menlo, Consolas, monospace',
} as const;

export const fontSize = {
  // Display
  "display-xl": ["96px", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
  "display-lg": ["72px", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
  "display-md": ["56px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
  // Heading
  "heading-xl": ["48px", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
  "heading-lg": ["40px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
  "heading-md": ["32px", { lineHeight: "1.15", letterSpacing: "-0.008em" }],
  "heading-sm": ["24px", { lineHeight: "1.2", letterSpacing: "-0.005em" }],
  // Body
  "body-xl": ["21px", { lineHeight: "1.5" }],
  "body-lg": ["19px", { lineHeight: "1.5" }],
  body: ["17px", { lineHeight: "1.47" }],       // default body
  "body-sm": ["15px", { lineHeight: "1.5" }],
  caption: ["13px", { lineHeight: "1.4" }],
  overline: ["13px", { lineHeight: "1.4", letterSpacing: "0.1em" }],
  micro: ["11px", { lineHeight: "1.4" }],
} as const;

// ---------------------------------------------------------------------------
// Spacing  (8px grid)
// ---------------------------------------------------------------------------

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  30: "120px",
  40: "160px",
  50: "200px",
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const borderRadius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
} as const;

// ---------------------------------------------------------------------------
// Motion  (follow system reduced-motion preference in CSS)
// ---------------------------------------------------------------------------

export const duration = {
  instant: "0ms",
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
  enter: "240ms",
  exit: "160ms",
} as const;

export const easing = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",   // elements entering
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",   // elements leaving
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;
