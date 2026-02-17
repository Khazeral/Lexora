/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Balatro-inspired palette from KotobaCards
        background: '#1b2838',
        foreground: '#e8edf5',
        card: '#24344a',
        'card-foreground': '#e8edf5',
        primary: '#5b8af5',
        'primary-foreground': '#ffffff',
        secondary: '#2a3d58',
        'secondary-foreground': '#b0bfda',
        muted: '#2a3d58',
        'muted-foreground': '#7a8da8',
        accent: '#f5c542',
        'accent-foreground': '#1b2838',
        destructive: '#f06070',
        success: '#44d9a0',
        border: '#344b68',
        input: '#2a3d58',
        ring: '#5b8af5',
        // Category colors
        cat: {
          blue: '#5b8af5',
          purple: '#b08dff',
          pink: '#f472b6',
          green: '#44d9a0',
          amber: '#f5c542',
          cyan: '#45c8f0',
          red: '#f06070',
        },
      },
    },
  },
  plugins: [],
};