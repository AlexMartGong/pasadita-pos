import axios from "axios";

// Scale REST server runs on port 8081 (separate from main backend)
// En desarrollo: usa proxy de Vite → localhost:8081
// En producción: apunta directamente al agente local
const scaleApi = axios.create({
    baseURL: import.meta.env.PROD
        ? 'http://localhost:8081'  // Producción: directo al agente local
        : '/api/scale',            // Desarrollo: usa proxy de Vite
    timeout: 10000, // Timeout for local hardware (10 seconds)
});

// Scale API doesn't require authentication (local hardware access)
scaleApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {scaleApi};
