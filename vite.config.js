import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            // Modo prompt: el SW nuevo queda en espera hasta que el usuario pulse "Actualizar" (PwaUpdatePrompt),
            // así una recarga automática nunca tira un carrito a medias. El registro vive en usePwaUpdate.
            registerType: 'prompt',
            injectRegister: false,
            workbox: {
                cleanupOutdatedCaches: true,
            },
            manifest: {
                name: 'La Pasadita POS',
                short_name: 'La Pasadita',
                description: 'Sistema de Punto de Venta y Gestión',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        proxy: {
            '/api/scale': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        target: 'esnext',
        minify: 'oxc',
        sourcemap: false,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {name: 'vendor', test: /node_modules[\\/](react|react-dom|react-router-dom)[\\/]/},
                        {name: 'redux', test: /node_modules[\\/](@reduxjs[\\/]toolkit|react-redux)[\\/]/},
                        {name: 'mui', test: /node_modules[\\/]@mui[\\/](material|icons-material)[\\/]/},
                    ]
                }
            }
        }
    }
})