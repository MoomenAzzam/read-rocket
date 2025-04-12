// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8", // Main primary color
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          400: "#a78bfa", // Purple accent
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        success: "#10b981", // Green for success states
        warning: "#f59e0b", // Yellow for warnings
        danger: "#ef4444", // Red for errors
      },
    },
  },
};
