import axios from "axios";

const dashboardApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/dashboard`,
    timeout: 15000,
});

dashboardApi.interceptors.request.use(
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

dashboardApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {dashboardApi};
