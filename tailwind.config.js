module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Arial', 'sans-serif'],
      },
      fontSize: {
        md: '1.2rem',  // Bigger for Markdown text
        lg: '1.5rem',  // Bigger for Markdown headings
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: '1.2rem',
            lineHeight: '1.75',
            fontFamily: 'Inter, sans-serif',
            h1: { fontSize: '2rem', fontWeight: 'bold' },
            h2: { fontSize: '1.75rem', fontWeight: 'bold' },
            h3: { fontSize: '1.5rem', fontWeight: 'bold' },
            p: { fontSize: '1.2rem' },
            code: {
              backgroundColor: '#1f2937',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '1rem',
            },
            pre: {
              backgroundColor: '#1f2937',
              padding: '1em',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontSize: '1rem',
            },
            img: {
              display: 'block',
              margin: '0 auto',
              maxWidth: '100%',
              borderRadius: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
