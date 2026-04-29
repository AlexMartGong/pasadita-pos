import axios from "axios";

const invoiceApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/invoices`,
    timeout: 10000,
});

invoiceApi.interceptors.request.use(
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

invoiceApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {invoiceApi};
