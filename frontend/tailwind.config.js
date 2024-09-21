/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/theme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "nextui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {},
      themes: {
        light: {
          layout: {},
          colors: {
            background: "#ccc",
            foreground: "#000",
            primary: {
              DEFAULT: "#002fff",
              foreground: "#fff",
            },
            success: {
              DEFAULT: "#e0ff4f",
              foreground: "#000",
            },
          },
        },
        // dark: {
        //   layout: {},
        //   colors: {
        //     background: "#111",
        //     foreground: "#fff",
        //     primary: {
        //       DEFAULT: "#0000ff",
        //       foreground: "#fff",
        //     },
        //     secondary: {
        //       DEFAULT: "#00ffff",
        //       foreground: "#000",
        //     },
        //     focus: "#fff",
        //   },
        // },
      },
    }),
  ],
};
