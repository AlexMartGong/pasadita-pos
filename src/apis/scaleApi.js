import axios from "axios";

const scaleApi = axios.create({
    baseURL: import.meta.env.PROD
        ? 'http://localhost:8081/api/scale'
        : '/api/scale',
    timeout: 10000,
});

scaleApi.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export {scaleApi};
