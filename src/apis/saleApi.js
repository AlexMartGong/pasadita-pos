import axios from "axios";

const saleApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/sales`,
    timeout: 10000,
});

saleApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

saleApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {saleApi};
