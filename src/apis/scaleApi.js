import axios from "axios";

// Scale REST server runs on port 8081 (separate from main backend)
const scaleApi = axios.create({
    baseURL: 'http://localhost:8081/api/scale',
    timeout: 3000, // Shorter timeout for local hardware
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
