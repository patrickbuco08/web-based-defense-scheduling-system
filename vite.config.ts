import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    server: {
        host: "localhost",
        port: 5173,
        strictPort: true,
        origin: "http://localhost:5173",
        cors: true,
        hmr: {
            host: "localhost",
        },
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
            ],
            refresh: true,
        }),
        react()
    ],
    resolve: {
        alias: {
            '@': path.resolve('resources/js'),
            '@css': path.resolve('resources/css'),
            '@pages': path.resolve('resources/js/Pages'),
            '@components': path.resolve('resources/js/Components'),
        },
    },
});
