import axios from "axios";

const productApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/products`,
    timeout: 10000,
});

productApi.interceptors.request.use(
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

productApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {productApi};
