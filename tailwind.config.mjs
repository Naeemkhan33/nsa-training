/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EE4140",
          50: "#FDE9E9",
          100: "#FBD6D6",
          200: "#F8B1B0",
          300: "#F58C8B",
          400: "#F16665",
          500: "#EE4140",
          600: "#E21514",
          700: "#AE1010",
          800: "#7B0C0B",
          900: "#470706",
          950: "#2E0404",
        },
      },
    },
  },
  plugins: [],
};
