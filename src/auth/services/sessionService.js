import {toast} from "react-toastify";
import {store} from "../../stores/store.js";
import {onLogin, onLogout} from "../../stores/slices/auth/authSlice.js";
import {logoutSession, refreshAccessToken} from "./authService.js";

export const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró. Inicia sesión de nuevo.';
const SESSION_REVOKED_MESSAGE = 'Por seguridad se cerró tu sesión. Inicia sesión de nuevo.';
const EMPLOYEE_INACTIVE_MESSAGE = 'Tu usuario está inactivo. Habla con el administrador.';

// En localStorage (como stationId) porque debe sobrevivir al cierre de la ventana.
const PENDING_LOGOUT_KEY = 'pendingLogout';

let refreshPromise = null;

export const getAccessToken = () => sessionStorage.getItem('token');

// Mismo objeto para login y refresh: isAdmin, role (de ahí sale hasLimitedAccess), user, employeeId y expiresAt.
const toLogin = (data) => {
    const roles = data.authorities?.map(auth => auth.authority) ?? [];
    return {
        isAuth: true,
        isAdmin: roles.includes('ROLE_ADMIN'),
        role: roles.join(', '),
        user: data.username,
        employeeId: data.employeeId ?? 0,
        expiresAt: data.expiresAt,
    };
};

export const saveSession = (data) => {
    const login = toLogin(data);
    sessionStorage.setItem('login', JSON.stringify(login));
    sessionStorage.setItem('token', data.token);
    localStorage.removeItem(PENDING_LOGOUT_KEY); // la nueva cookie reemplaza a la que no se pudo revocar
    store.dispatch(onLogin(login));
    return login;
};

// Idempotente: varias peticiones que fallan a la vez cierran la sesión y avisan una sola vez.
export const endSession = (message) => {
    const {isAuth, isRestoring} = store.getState().auth;
    if (!isAuth && !isRestoring) return;
    sessionStorage.clear(); // stationId vive en localStorage y se conserva
    store.dispatch(onLogout());
    if (message) toast.warning(message);
};

// Un logout que no llegó al backend deja viva la cookie. Hasta revocarla el arranque no restaura la sesión:
// en una terminal compartida la abriría el siguiente usuario.
export const revokeSession = async () => {
    try {
        await logoutSession();
        localStorage.removeItem(PENDING_LOGOUT_KEY);
    } catch {
        localStorage.setItem(PENDING_LOGOUT_KEY, '1');
    }
};

export const hasPendingLogout = () => localStorage.getItem(PENDING_LOGOUT_KEY) !== null;

const refreshErrorMessage = (data) => {
    if (data?.error === 'refresh_token_reused') return SESSION_REVOKED_MESSAGE;
    // EmployeeInactiveException responde el mismo cuerpo que el login fallido.
    if (data?.message === 'Login failed') return EMPLOYEE_INACTIVE_MESSAGE;
    // Al arrancar sin sesión (equipo nuevo, logout previo, 60 días sin uso) basta con la pantalla de login.
    return store.getState().auth.isRestoring ? null : SESSION_EXPIRED_MESSAGE;
};

const runRefresh = async () => {
    try {
        const {data} = await refreshAccessToken();
        const {isAuth, isRestoring} = store.getState().auth;
        // Un logout mientras el refresh viajaba gana: no se resucita la sesión.
        if (isAuth || isRestoring) saveSession(data);
        return data;
    } catch (error) {
        if (error.response?.status === 401) endSession(refreshErrorMessage(error.response.data));
        throw error;
    }
};

// Single-flight: las peticiones que reciben 401 a la vez esperan la misma renovación.
export const refreshSession = () => {
    refreshPromise ??= runRefresh().finally(() => {
        refreshPromise = null;
    });
    return refreshPromise;
};
