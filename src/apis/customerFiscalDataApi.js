import axios from "axios";

const customerFiscalDataApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/customer-fiscal-data`,
    timeout: 10000,
});

customerFiscalDataApi.interceptors.request.use(
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

customerFiscalDataApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {customerFiscalDataApi};
