import {describe, expect, it} from 'vitest';
import {formatMoney, fromCents, parseMoneyInput, toCents} from '../money.js';

describe('toCents', () => {
    it('convierte números de la API sin errores de flotante', () => {
        expect(toCents(700)).toBe(70000);
        expect(toCents(0.29)).toBe(29);
        expect(toCents(1.15)).toBe(115);
        expect(toCents(390.5)).toBe(39050);
    });

    it('acepta texto con punto o coma decimal', () => {
        expect(toCents('400.25')).toBe(40025);
        expect(toCents('400,25')).toBe(40025);
        expect(toCents('')).toBe(0);
        expect(toCents(null)).toBe(0);
    });
});

describe('fromCents', () => {
    it('devuelve el monto con a lo más 2 decimales', () => {
        expect(fromCents(40025)).toBe(400.25);
        expect(fromCents(29)).toBe(0.29);
        expect(JSON.stringify(fromCents(11000))).toBe('110');
    });
});

describe('parseMoneyInput', () => {
    it('acepta enteros y hasta 2 decimales', () => {
        expect(parseMoneyInput('0')).toEqual({cents: 0, valid: true});
        expect(parseMoneyInput('500')).toEqual({cents: 50000, valid: true});
        expect(parseMoneyInput('12.5')).toEqual({cents: 1250, valid: true});
        expect(parseMoneyInput(' 12,05 ')).toEqual({cents: 1205, valid: true});
        expect(parseMoneyInput('.50')).toEqual({cents: 50, valid: true});
        expect(parseMoneyInput(',5')).toEqual({cents: 50, valid: true});
    });

    it('rechaza vacío, negativos, más de 2 decimales y texto', () => {
        expect(parseMoneyInput('').valid).toBe(false);
        expect(parseMoneyInput('-5').valid).toBe(false);
        expect(parseMoneyInput('1.234').valid).toBe(false);
        expect(parseMoneyInput('abc').valid).toBe(false);
        expect(parseMoneyInput('1,000.50').valid).toBe(false);
        expect(parseMoneyInput('.').valid).toBe(false);
    });
});

describe('formatMoney', () => {
    it('formatea centavos como MXN con 2 decimales', () => {
        expect(formatMoney(123456)).toBe('$1,234.56');
        expect(formatMoney(0)).toBe('$0.00');
        expect(formatMoney(29)).toBe('$0.29');
    });
});
