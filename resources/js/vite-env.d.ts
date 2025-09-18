/// <reference types="vite/client" />

declare module '*.css' {
    const content: string;
    export default content;
}

// Add other module declarations as needed