import { scopedPreflightStyles, isolateInsideOfContainer } from 'tailwindcss-scoped-preflight';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        gray: "#2B2A2A",
        "gray-black": "#1B1B1B",
        "soft-cream": "#FADCB4",
        "cream": "#E7DDD1",
        "primary-brass": "#B09668",
        "primary-orange": "#CD954A",
        "primary-dark": "#1E1E1E",
        "primary-darker": "#181818",
        "correct": "#70B3A3",
        "wrong": "#DE8073",
        "not-answered": "#9C8F80"
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [
    require('daisyui'),
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer([".tw-class", "#tw-id"]),
    }),
  ],
  daisyui: {
    themes: ["light"],
  },
}