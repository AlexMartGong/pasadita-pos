import axios from "axios";
import {endSession, getAccessToken, refreshSession, SESSION_EXPIRED_MESSAGE} from "../auth/services/sessionService.js";

// Instancia de una API de dominio: pone el access token y, ante un 401, renueva la sesión (una sola vez por
// petición) y la reintenta. Login, refresh y logout usan `authApi`, que no pasa por aquí: no hay bucles posibles.
export const createApiClient = (path, {timeout = 10000} = {}) => {
    const client = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}${path}`,
        timeout,
    });

    client.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    client.interceptors.response.use(undefined, async (error) => {
        const {config, response} = error;
        if (response?.status !== 401 || !config) {
            throw error;
        }
        if (config._retried) {
            // El token recién renovado también fue rechazado: no hay sesión que salvar.
            endSession(SESSION_EXPIRED_MESSAGE);
            throw error;
        }
        config._retried = true;
        // Si otra petición ya renovó el token mientras esta viajaba, basta con reintentar.
        if (config.headers.Authorization === `Bearer ${getAccessToken()}`) {
            await refreshSession();
        }
        return client(config);
    });

    return client;
};
