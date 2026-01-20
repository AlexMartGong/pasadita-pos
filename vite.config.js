import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api/scale': {
                target: 'http://localhost:8081/api/scale',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    redux: ['@reduxjs/toolkit', 'react-redux'],
                    mui: ['@mui/material', '@mui/icons-material'],
                }
            }
        }
    }
})