import axios from "axios";

const deliveryOrderApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/delivery-orders`,
    timeout: 10000,
});

deliveryOrderApi.interceptors.request.use(
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

deliveryOrderApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {deliveryOrderApi};

