import {useCallback} from "react";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS} from "./accountErrorOptions.js";

// Ejecuta una operación de escritura y devuelve {ok, data, status, fieldErrors, isNetworkError}: así los
// diálogos pueden marcar campos y ofrecer "Reintentar" sin repetir el manejo de errores.
export const useAccountRequest = () => {
    const {handleApiError} = useApiErrorHandler();

    const runRequest = useCallback(async (request) => {
        try {
            const data = await request();
            return {ok: true, data, status: null, fieldErrors: null, isNetworkError: false};
        } catch (error) {
            return {ok: false, data: null, ...handleApiError(error, ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS)};
        }
    }, [handleApiError]);

    return {runRequest};
};
