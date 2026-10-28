import {formatMoney} from "./money.js";

// Acciones del historial de un abono (`sale_payment_history.action`).
export const PAYMENT_HISTORY_ACTIONS = {
    CREADO: {label: 'Creado', color: 'success', dot: '#2e7d32'},
    MODIFICADO: {label: 'Modificado', color: 'info', dot: '#0277bd'},
    CANCELADO: {label: 'Cancelado', color: 'error', dot: '#c62828'},
};

const arrow = (previous, next) => (previous === next ? next : `${previous} → ${next}`);

// Monto y método anterior → nuevo, según la acción: CREADO solo trae los nuevos y CANCELADO solo los anteriores.
export const describeHistoryAmount = (entry) => {
    if (entry.action === 'CREADO') return formatMoney(entry.newAmount);
    if (entry.action === 'CANCELADO') return `${formatMoney(entry.previousAmount)} cancelado`;
    return arrow(formatMoney(entry.previousAmount), formatMoney(entry.newAmount));
};

export const describeHistoryMethod = (entry) => {
    if (entry.action === 'CREADO') return entry.newPaymentMethodName ?? '';
    if (entry.action === 'CANCELADO') return entry.previousPaymentMethodName ?? '';
    return arrow(entry.previousPaymentMethodName ?? '', entry.newPaymentMethodName ?? '');
};
