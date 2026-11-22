import {useEffect} from "react";
import {useSelector} from "react-redux";
import {refreshSession} from "../services/sessionService.js";

const RENEW_BEFORE_MS = 5 * 60 * 1000;

// Renueva el access token ~5 min antes de que venza y al volver a primer plano: con la app en segundo plano
// (PWA del celular, pestaña oculta, equipo suspendido) los timers se congelan.
export const useSessionKeeper = () => {
    const expiresAt = useSelector(state => state.auth.expiresAt);

    useEffect(() => {
        if (!expiresAt) return undefined;
        const renewAt = expiresAt - RENEW_BEFORE_MS;
        // Un 401 ya cerró la sesión en sessionService; sin red, el siguiente 401 reintenta.
        const renew = () => refreshSession().catch(() => {});
        const timer = setTimeout(renew, Math.max(0, renewAt - Date.now()));
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && Date.now() >= renewAt) renew();
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [expiresAt]);
};
