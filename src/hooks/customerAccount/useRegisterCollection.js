import {useCallback} from "react";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {customerAccountService} from "../../services/customerAccountService.js";
import {ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS} from "./accountErrorOptions.js";

// Un cobro de $0 no guarda abonos, así que el backend no reconoce su reintento y responde 400 "no está
// ACTIVO". Si la nota ya está pendiente sin abonos, el primer intento sí se guardó: se arma su resultado.
const findSavedZeroCollection = async (customerId, saleId) => {
    try {
        const account = await customerAccountService.getAccount(customerId);
        const note = account.pendingNotes.find((pending) => pending.saleId === saleId);
        if (!note || note.paidAmount !== 0) return null;
        return {
            orderStatus: 'PENDIENTE',
            saleBalance: note.balance,
            customerDebt: account.totalDebt,
            creditLimit: account.creditLimit,
            overLimit: account.overLimit,
            change: 0,
            appliedPayments: [],
        };
    } catch {
        return null;
    }
};

export const useRegisterCollection = () => {
    const {handleApiError} = useApiErrorHandler();

    const registerCollection = useCallback(async ({
        orderId, saleId, customerId, amountReceived, paymentMethodId, clientRequestId, isRetry,
    }) => {
        try {
            const data = await customerAccountService.registerCollection(orderId, {
                amountReceived, paymentMethodId, clientRequestId,
            });
            return {ok: true, data};
        } catch (error) {
            if (isRetry && amountReceived === 0 && error.response?.status === 400) {
                const saved = await findSavedZeroCollection(customerId, saleId);
                if (saved) return {ok: true, data: saved};
            }
            return {ok: false, data: null, ...handleApiError(error, ACCOUNT_ERROR_MESSAGES, ACCOUNT_ERROR_OPTIONS)};
        }
    }, [handleApiError]);

    return {registerCollection};
};
