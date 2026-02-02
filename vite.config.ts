import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    server: {
        port: 8090,
        open: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
