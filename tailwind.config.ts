import type { Config } from "tailwindcss";

// plugin to add each Tailwind color as a global CSS

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({addBase, theme}: any) {
  const allColors = flattenColorPalette(theme('colors'));
  
  if (typeof allColors === 'object' && allColors !== null) {
    const newVars = Object.fromEntries(
      Object.entries(allColors).map(([key, value]) => [`--${key}`, value])
    );
    
    addBase({
      ':root': newVars,
    });
  } else {
    console.warn('allColors is not an object or is null');
  }
}

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [addVariablesForColors],
} satisfies Config;
function flattenColorPalette(_arg0: Record<string, string | Record<string, string>>) {
  // Implement the function logic here
  return _arg0;
}

