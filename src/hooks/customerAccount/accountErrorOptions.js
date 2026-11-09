// Opciones de useApiErrorHandler para abonos y crédito (U7): el 400 muestra el mensaje del backend (viene
// en español); 403, 404 y 500 usan textos propios porque los del backend vienen en inglés.
export const ACCOUNT_ERROR_MESSAGES = {
    400: 'Revisa los datos capturados.',
    403: 'No tienes permiso para esta acción',
    404: 'No se encontró el registro',
    500: 'Ocurrió un error inesperado. Intenta de nuevo.',
};

export const ACCOUNT_ERROR_OPTIONS = {serverMessageStatuses: [400]};
