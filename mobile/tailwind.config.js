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
        // KotobaCards exact palette - adjusted brightness
        background: '#25603e',
        foreground: '#e8edf5',
        card: '#134c39',
        'card-foreground': '#e8edf5',
        primary: '#e8453c',
        'primary-foreground': '#ffffff',
        secondary: '#0c3429',
        'secondary-foreground': '#8fbfaa',
        muted: '#030f0b',
        'muted-foreground': '#90c0ac',
        accent: '#f5c542',
        'accent-foreground': '#0b3d2e',
        destructive: '#e8453c',
        'destructive-foreground': '#ffffff',
        success: '#44d9a0',
        'success-foreground': '#0b3d2e',
        border: '#2a7a60',
        input: '#093328',
        ring: '#e8453c',
        info: '#5b8af5',
        'info-foreground': '#ffffff',
        // Dark badge background
        badge: '#0a1f18',
        // Category colors
        cat: {
          blue: '#5b8af5',
          purple: '#b08dff',
          pink: '#f472b6',
          green: '#44d9a0',
          amber: '#f5c542',
          cyan: '#45c8f0',
          red: '#e8453c',
        },
      },
    },
  },
  plugins: [],
};