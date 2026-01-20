import axios from "axios";

// Scale REST server runs on port 8081 (separate from main backend)
// Using environment variable for production flexibility
const scaleApi = axios.create({
    baseURL: import.meta.env.VITE_SCALE_API_URL || 'http://localhost:8081/api/scale',
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
