import axios from "axios";

const salePaymentApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/sale-payments`,
    timeout: 10000,
});

salePaymentApi.interceptors.request.use(
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

salePaymentApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {salePaymentApi};
