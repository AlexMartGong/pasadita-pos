import {authApi} from "../../apis/authApi.js";

export const loginValidation = async ({username, password}) => {
    try {
        return await authApi.post('/login', {username, password});
    } catch (error) {
        console.error("Error in loginValidation:", error);
        throw error;
    }
};

// La cookie httpOnly es la credencial: sin body ni Authorization. Un 401 al arrancar es lo normal sin sesión.
export const refreshAccessToken = () => authApi.post('/api/auth/refresh');

// Siempre 204. Timeout corto: sin red, el logout local no debe esperar 10 s.
export const logoutSession = () => authApi.post('/api/auth/logout', null, {timeout: 3000});
