import axios from "axios";

const userApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/employees`,
    timeout: 10000,
});

userApi.interceptors.request.use(
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

userApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        console.log('API Error:', error);
        return Promise.reject(error);
    }
);

export {userApi};
