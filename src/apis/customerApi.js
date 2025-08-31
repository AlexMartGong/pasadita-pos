import axios from "axios";

const customerApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/customers`,
    timeout: 10000,
});

customerApi.interceptors.request.use(
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

customerApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {customerApi};
