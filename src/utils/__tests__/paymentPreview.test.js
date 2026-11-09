import {describe, expect, it} from 'vitest';
import {
    allocateOldestFirst,
    editCap,
    previewAccountPayment,
    previewCancel,
    previewCollection,
    previewEdit,
    previewNotePayment,
} from '../paymentPreview.js';

// Ejemplo del negocio: nota A de $1,000 con $300 abonados (saldo $700) y nota B de $677.
const account = {
    totalDebt: 137700,
    creditLimit: 150000,
    pendingNotes: [
        {saleId: 10, balance: 70000},
        {saleId: 11, balance: 67700},
    ],
};

describe('allocateOldestFirst', () => {
    it('llena primero la nota más vieja', () => {
        expect(allocateOldestFirst(account.pendingNotes, 80000)).toEqual({
            allocations: [
                {saleId: 10, amount: 70000, remainingBalance: 0},
                {saleId: 11, amount: 10000, remainingBalance: 57700},
            ],
            change: 0,
        });
    });

    it('sin notas todo es cambio', () => {
        expect(allocateOldestFirst([], 5000)).toEqual({allocations: [], change: 5000});
    });
});

describe('previewCollection', () => {
    it('cobro de $500 sobre un pedido de $390: $110 a la nota A, que queda en $590, sin cambio', () => {
        const preview = previewCollection({orderTotal: 39000, amount: 50000, saleId: 20, account});
        expect(preview.kind).toBe('surplus');
        expect(preview.surplus).toBe(11000);
        expect(preview.allocations).toEqual([{saleId: 10, amount: 11000, remainingBalance: 59000}]);
        expect(preview.change).toBe(0);
        expect(preview.newDebt).toBe(126700);
    });

    it('excedente mayor que toda la deuda: salda todo y el resto es cambio', () => {
        const preview = previewCollection({orderTotal: 39000, amount: 200000, saleId: 20, account});
        expect(preview.allocations).toEqual([
            {saleId: 10, amount: 70000, remainingBalance: 0},
            {saleId: 11, amount: 67700, remainingBalance: 0},
        ]);
        expect(preview.change).toBe(23300);
        expect(preview.newDebt).toBe(0);
    });

    it('faltante: lo que no pagó se suma a la deuda', () => {
        const preview = previewCollection({
            orderTotal: 70000, amount: 40000, saleId: 20, account: {...account, totalDebt: 67700},
        });
        expect(preview).toEqual({
            kind: 'shortfall', pending: 30000, newDebt: 97700, creditLimit: 150000, overLimit: false,
        });
    });

    it('faltante que rebasa el límite', () => {
        const preview = previewCollection({
            orderTotal: 70000, amount: 40000, saleId: 20, account: {...account, totalDebt: 67700, creditLimit: 90000},
        });
        expect(preview.overLimit).toBe(true);
    });

    it('$0: todo el pedido queda pendiente', () => {
        const preview = previewCollection({orderTotal: 70000, amount: 0, saleId: 20, account: {...account, totalDebt: 0}});
        expect(preview.kind).toBe('shortfall');
        expect(preview.pending).toBe(70000);
        expect(preview.newDebt).toBe(70000);
    });

    it('pago exacto: no hay nada que registrar', () => {
        expect(previewCollection({orderTotal: 70000, amount: 70000, saleId: 20, account}).kind).toBe('exact');
    });

    it('montos con centavos', () => {
        const preview = previewCollection({
            orderTotal: 39050, amount: 40025, saleId: 20, account: {totalDebt: 0, creditLimit: 0, pendingNotes: []},
        });
        expect(preview.surplus).toBe(975);
        expect(preview.change).toBe(975);
    });

    it('nunca abona el excedente a la propia nota del pedido', () => {
        const preview = previewCollection({
            orderTotal: 39000, amount: 50000, saleId: 10, account,
        });
        expect(preview.allocations).toEqual([{saleId: 11, amount: 11000, remainingBalance: 56700}]);
    });
});

describe('previewAccountPayment', () => {
    it('reparte el abono en tienda y devuelve el cambio', () => {
        expect(previewAccountPayment({amount: 150000, account})).toEqual({
            allocations: [
                {saleId: 10, amount: 70000, remainingBalance: 0},
                {saleId: 11, amount: 67700, remainingBalance: 0},
            ],
            change: 12300,
            newDebt: 0,
        });
    });
});

describe('previewNotePayment', () => {
    it('tope = saldo de la nota', () => {
        expect(previewNotePayment({amount: 30000, noteBalance: 70000})).toEqual({exceedsBalance: false, newBalance: 40000});
        expect(previewNotePayment({amount: 70001, noteBalance: 70000}).exceedsBalance).toBe(true);
    });
});

describe('edición y cancelación de abonos', () => {
    const payments = [
        {paymentId: 1, amount: 40000, status: 'APLICADO'},
        {paymentId: 2, amount: 20000, status: 'APLICADO'},
        {paymentId: 3, amount: 10000, status: 'CANCELADO'},
    ];

    it('el tope ignora el abono editado y los cancelados', () => {
        expect(editCap({noteTotal: 70000, payments, paymentId: 1})).toBe(50000);
    });

    it('vista previa de edición', () => {
        expect(previewEdit({noteTotal: 70000, payments, paymentId: 1, newAmount: 30000})).toEqual({
            before: 10000, after: 20000, cap: 50000, exceedsCap: false,
        });
        expect(previewEdit({noteTotal: 70000, payments, paymentId: 1, newAmount: 50001}).exceedsCap).toBe(true);
    });

    it('vista previa de cancelación', () => {
        expect(previewCancel({noteTotal: 70000, payments, paymentId: 2})).toEqual({before: 10000, after: 30000});
        expect(previewCancel({noteTotal: 70000, payments, paymentId: 3})).toEqual({before: 10000, after: 10000});
    });
});
