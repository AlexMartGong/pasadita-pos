import {useAuth} from "../auth/hooks/useAuth.js";
import {useCallback} from "react";
import {toast} from "react-toastify";

const getServerErrorMessage = (data) => {
    const message = data?.error;
    return typeof message === 'string' && message.trim() ? message : null;
};

// Errores de validación de Spring (@Valid): un mapa plano {campo: mensaje}, sin la clave `error`.
const getFieldErrors = (status, data) => {
    if (status !== 400 || !data || typeof data !== 'object' || Array.isArray(data) || 'error' in data) {
        return null;
    }
    const entries = Object.entries(data);
    if (entries.length === 0 || !entries.every(([, value]) => typeof value === 'string')) {
        return null;
    }
    return Object.fromEntries(entries);
};

export const useApiErrorHandler = () => {
    const {handlerLogout} = useAuth();

    // Muestra el toast y devuelve {status, message, fieldErrors, isNetworkError} para que la vista que lo
    // necesite marque campos u ofrezca "Reintentar".
    const handleApiError = useCallback((error, customMessages = {}, {serverMessageStatuses = []} = {}) => {
        let outcome;

        if (error.response) {
            const status = error.response.status;
            const defaultMessages = {
                400: 'Solicitud incorrecta.',
                401: 'No autorizado. Por favor, inicie sesión nuevamente.',
                403: 'No tiene permisos para realizar esta acción.',
                404: 'Recurso no encontrado.',
                409: 'Conflicto con el recurso existente.',
                422: 'Datos de entrada inválidos.',
                429: 'Demasiadas solicitudes. Intente más tarde.',
                500: 'Error interno del servidor.',
                502: 'Servidor no disponible.',
                503: 'Servicio temporalmente no disponible.',
                default: 'Error inesperado.'
            };

            // Mensaje del backend solo para los status que el llamador habilita: los 403/500 de Spring
            // vienen en inglés ("Forbidden", "An unexpected error occurred").
            const serverMessage = serverMessageStatuses.includes(status)
                ? getServerErrorMessage(error.response.data)
                : null;
            const message = serverMessage || customMessages[status] || defaultMessages[status] || defaultMessages.default;
            toast.error(message);

            if (status === 401) {
                handlerLogout();
            }

            outcome = {
                status,
                message,
                fieldErrors: getFieldErrors(status, error.response.data),
                isNetworkError: false,
            };
        } else if (error.request) {
            const message = 'Error de conexion. Verifica tu conexion a internet.';
            toast.error(message);
            outcome = {status: null, message, fieldErrors: null, isNetworkError: true};
        } else {
            const message = 'Error inesperado.';
            toast.error(message);
            outcome = {status: null, message, fieldErrors: null, isNetworkError: false};
        }

        console.error('Error:', error);
        return outcome;
    }, [handlerLogout]);

    return {
        handleApiError
    };
};
