/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', '"Outfit"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        nunito: ['"Nunito"', '"Outfit"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        attendance: ['"Nunito"', '"Outfit"', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.1rem' }],     // ~12.4px
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // ~13.4px (up from 12px)
        'sm': ['0.9375rem', { lineHeight: '1.4rem' }],    // ~15.5px (up from 14px)
        'base': ['1.0625rem', { lineHeight: '1.6rem' }],  // ~17.5px (up from 16px)
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }],   // ~19.6px (up from 18px)
        'xl': ['1.3125rem', { lineHeight: '1.85rem' }],   // ~21.6px (up from 20px)
        '2xl': ['1.625rem', { lineHeight: '2.15rem' }],   // ~26.8px (up from 24px)
        '3xl': ['2rem', { lineHeight: '2.4rem' }],        // ~33px (up from 30px)
        '4xl': ['2.5rem', { lineHeight: '2.8rem' }],      // ~41px (up from 36px)
      },
      colors: {
        brand: {
          // The 4 Core Brand Colors from Logo Swatch
          cyan: "#00CEE6",       // Swatch 1: Electric Cyan (Top Wing)
          navy: "#11233D",       // Swatch 2: Midnight Navy (Head & Body)
          purple: "#825FEF",     // Swatch 3: Royal Violet (Inner Wing)
          silver: "#ACBACC",     // Swatch 4: Platinum Slate (Center Wing)
          
          // Canvas & Surfaces
          canvas: "#EFF4F7",
          card: "#FFFFFF",
        },
        // Semantic Functional Colors
        status: {
          approvedBg: "#E8F8F0",
          approvedText: "#10B981",
          pendingBg: "#FFF1E6",
          pendingText: "#F97316",
          dangerBg: "#FEE2E2",
          dangerText: "#EF4444",
          gold: "#FFBE0B",
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 30, 54, 0.05), 0 2px 6px -1px rgba(15, 30, 54, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(15, 30, 54, 0.08), 0 4px 10px -2px rgba(15, 30, 54, 0.04)',
        'orb': '0 0 50px rgba(0, 210, 234, 0.45), 0 0 90px rgba(124, 92, 252, 0.35)',
      }
    },
  },
  plugins: [],
};
