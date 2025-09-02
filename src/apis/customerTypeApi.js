import axios from "axios";

const customerTypeApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/customer-types`,
    timeout: 10000,
});

customerTypeApi.interceptors.request.use(
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

customerTypeApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {customerTypeApi};
