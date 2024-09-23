import flowbite from "flowbite-react/tailwind";
require('flowbite-typography')
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./node_modules/flowbite/**/*.js", 
    "node_modules/flowbite-react/lib/esm/**/*.js",
    flowbite.content()
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite-typography'),
    flowbite.plugin(),
  ],
};
