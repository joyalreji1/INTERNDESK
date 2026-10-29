/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        portal: {
          primary: '#4779B8',       // Primary blue
          header: '#356F9D',        // Header blue
          headerDark: '#28587E',    // Darker active blue
          light: '#EAF2FC',         // Light blue
          section: '#7FA8E8',       // Section header blue
          bg: '#F5F7FA',            // Main background
          border: '#D4DCE6',        // Border grey
          borderDark: '#B8C6D6',    // Darker border
          text: '#333333',          // Body text
          muted: '#666666',         // Muted grey text
          successBg: '#DDEED8',     // Success green bg
          successText: '#285C2A',   // Success green text
          warningBg: '#FFF0CE',     // Warning amber bg
          warningText: '#855A00',   // Warning amber text
          error: '#C94242',         // Error red
          errorBg: '#FDE8E8',       // Error light bg
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
};
