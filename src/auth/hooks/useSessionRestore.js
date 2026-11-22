import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onLogout} from "../../stores/slices/auth/authSlice.js";
import {refreshSession} from "../services/sessionService.js";

// Arranque sin token vigente: la cookie del refresh decide si hay sesión.
export const useSessionRestore = () => {
    const dispatch = useDispatch();
    const [failed, setFailed] = useState(false);

    const attempt = useCallback(() => {
        refreshSession().catch((error) => {
            // Un 401 ya mandó al login (sessionService). Sin red o con el servidor caído la cookie puede seguir viva.
            if (error.response?.status !== 401) setFailed(true);
        });
    }, []);

    useEffect(() => {
        attempt();
    }, [attempt]);

    const retry = () => {
        setFailed(false);
        attempt();
    };

    // Salida manual por si el refresh falla del lado del servidor.
    const goToLogin = () => dispatch(onLogout());

    return {failed, retry, goToLogin};
};
