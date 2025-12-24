/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0eaff',
                    200: '#c7d9ff',
                    300: '#9ec0ff',
                    400: '#709dff',
                    500: '#4778ff', // Brand Blue
                    600: '#2554eb',
                    700: '#1d42d9',
                    800: '#1e37af',
                    900: '#1e328a',
                },
                visa: {
                    blue: '#1A1F71',
                    gold: '#F7B600'
                }
            }
        },
    },
    plugins: [],
}
