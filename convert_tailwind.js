const fs = require('fs');
const tailwind = require('./tailwind.config.js');

const colors = tailwind.theme.extend.colors;

let tailwindConfigNew = `// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {\n`;

let cssRoot = `:root {\n`;
let cssDark = `.dark {\n`;

const generateDarkHex = (hex) => {
    // A simple heuristic or just a placeholder for now.
    // The user's prompt says "white the default", which is light mode.
    // To make dark mode look good, we can use a library like 'chroma-js' if it's available,
    // or just invert lightness. Let's just do a basic inversion for now.
    return hex; // I will do it properly with CSS
}

for (const [key, val] of Object.entries(colors)) {
    tailwindConfigNew += `        "${key}": "var(--color-${key})",\n`;
    cssRoot += `  --color-${key}: ${val};\n`;
}
tailwindConfigNew += `      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      }
    }
  },
  plugins: []
}
`;
cssRoot += `}\n`;

fs.writeFileSync('tailwind.config.new.js', tailwindConfigNew);
fs.writeFileSync('css_vars.css', cssRoot);
console.log("Done");
