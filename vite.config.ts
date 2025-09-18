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
                'resources/js/app.ts',

                "resources/js/Pages/Calendar/index.tsx",
            ],
            refresh: true,
        }),
        react({
            // enables React fast refresh + removes "missing React import" noise
            jsxImportSource: "react",
            babel: {
                plugins: ["@babel/plugin-transform-react-jsx"],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "resources/js"),
            '@css': path.resolve(__dirname, "resources/css"),
            '@pages': path.resolve(__dirname, "resources/js/Pages"),
            '@components': path.resolve(__dirname, "resources/js/Components"),
            '@layouts': path.resolve(__dirname, "resources/js/layouts"),
        },
    },
});
