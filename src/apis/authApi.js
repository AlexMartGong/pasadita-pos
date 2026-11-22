import axios from "axios";

// Login, refresh y logout: sin interceptores (no llevan Bearer ni disparan el refresh) y con withCredentials,
// sin el cual el navegador descarta la cookie httpOnly del refresh token (la API está en otro origen).
export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});
