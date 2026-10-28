import {defineConfig} from 'vitest/config';

// Configuración aparte de vite.config.js para no cargar el plugin PWA: los tests cubren solo utilidades puras.
export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.js'],
    },
});
