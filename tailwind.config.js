import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                kai: {
                    navy: '#1b365d',
                    blue: '#2563eb', // Light Blue / Action
                    blueLight: '#1B497E',
                    orange: '#f97316',
                    red: '#DC2626', green: '#16A34A', yellow: '#CA8A04', purple: '#7C3AED',
                    orangeHover: '#ea580c'
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                'card': '0 2px 10px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
            }
        },
    },

    plugins: [forms],
};
