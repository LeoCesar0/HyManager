/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1600px",
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      transitionProperty: {
        "border-text": "border-color, color",
        border: "border-color",
        text: "color",
      },
      colors: (theme) => ({
        primary: "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-selected": "var(--color-primary-selected)",
        "primary-dark": "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        "on-secondary": "var(--color-on-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",
        "secondary-selected": "var(--color-secondary-selected)",
        "secondary-dark": "var(--color-secondary-dark)",
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-on-accent)",
        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        hint: "var(--color-hint)",
        error: "var(--color-error)",
        disabled: "var(--color-disabled)",
        'disabled-border': "var(--color-disabled-border)",
        'disabled-text': "var(--color-disabled-text)",
        debit: theme.colors.red[500],
        deposit: theme.colors.blue[600]
      }),
    },
  },
  plugins: [],
};
