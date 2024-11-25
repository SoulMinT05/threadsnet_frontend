/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Đường dẫn các file của bạn
        './node_modules/@shadcn/ui/dist/**/*.js', // Cấu hình để shadcn hoạt động
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
