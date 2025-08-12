import {useAuth} from "../auth/hooks/useAuth.js";
import {useCallback} from "react";
import {toast} from "react-toastify";

export const useApiErrorHandler = () => {
    const {handlerLogout} = useAuth();

    const handleApiError = useCallback((error, customMessages = {}) => {
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
            const message = customMessages[status] || defaultMessages[status] || defaultMessages.default;
            toast.error(message);
            if (status === 401) {
                handlerLogout();
            }
        } else if (error.request) {
            toast.error('Error de conexion. Verifica tu conexion a internet.');
        } else {
            toast.error('Error inesperado.');
        }

        console.error('Error:', error);
    }, [handlerLogout]);

    return {
        handleApiError
    };

};
