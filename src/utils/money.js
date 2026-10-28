import {toNumber} from "./formatters.js";

// Dinero de abonos y crédito: toda cuenta de la UI se hace con centavos enteros, nunca con flotantes.

const MONEY_INPUT_PATTERN = /^(\d+([.,]\d{0,2})?|[.,]\d{1,2})$/;

const moneyFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// Monto (número de la API o texto capturado, acepta "," decimal) → centavos enteros.
export const toCents = (value) => Math.round(toNumber(value) * 100);

// Centavos → número con a lo más 2 decimales, listo para el payload.
export const fromCents = (cents) => cents / 100;

// Centavos → "$1,234.56".
export const formatMoney = (cents) => moneyFormatter.format((cents || 0) / 100);

// Texto de un campo de monto: dígitos, separador opcional y hasta 2 decimales (".50" también, como se teclea en
// el celular); nada de negativos.
export const parseMoneyInput = (text) => {
    const trimmed = String(text ?? '').trim();
    if (!MONEY_INPUT_PATTERN.test(trimmed)) return {cents: 0, valid: false};
    return {cents: toCents(trimmed), valid: true};
};
