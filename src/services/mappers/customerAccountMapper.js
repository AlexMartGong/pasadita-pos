import {toCents} from "../../utils/money.js";

// Respuestas de abonos y crédito → modelo de la UI con todo el dinero en centavos enteros.

const centsOrNull = (value) => (value === null || value === undefined ? null : toCents(value));

export const mapAppliedPayment = (applied) => ({
    saleId: applied.saleId,
    amount: toCents(applied.amount),
    remainingBalance: toCents(applied.remainingBalance),
});

export const mapPaymentResult = (data) => ({
    orderStatus: data.orderStatus ?? null,
    saleBalance: centsOrNull(data.saleBalance),
    customerDebt: toCents(data.customerDebt),
    creditLimit: toCents(data.creditLimit),
    overLimit: Boolean(data.overLimit),
    change: toCents(data.change),
    appliedPayments: (data.appliedPayments ?? []).map(mapAppliedPayment),
});

export const mapPaymentDetail = (payment) => ({
    paymentId: payment.paymentId,
    datetime: payment.datetime,
    amount: toCents(payment.amount),
    paymentMethodId: payment.paymentMethodId,
    paymentMethodName: payment.paymentMethodName,
    employeeId: payment.employeeId,
    employeeName: payment.employeeName,
    notes: payment.notes,
    status: payment.status,
    modified: Boolean(payment.modified),
    editable: Boolean(payment.editable),
});

export const mapPendingNote = (note) => ({
    saleId: note.saleId,
    orderId: note.orderId,
    datetime: note.datetime,
    total: toCents(note.total),
    paidAmount: toCents(note.paidAmount),
    balance: toCents(note.balance),
    payments: (note.payments ?? []).map(mapPaymentDetail),
});

export const mapAccount = (account) => ({
    customerId: account.customerId,
    name: account.name,
    creditLimit: toCents(account.creditLimit),
    totalDebt: toCents(account.totalDebt),
    availableCredit: toCents(account.availableCredit),
    overLimit: Boolean(account.overLimit),
    pendingNotes: (account.pendingNotes ?? []).map(mapPendingNote),
});

export const mapDebt = (debt) => ({
    customerId: debt.customerId,
    name: debt.name,
    phone: debt.phone,
    creditLimit: toCents(debt.creditLimit),
    totalDebt: toCents(debt.totalDebt),
    pendingNotes: debt.pendingNotes,
    overLimit: Boolean(debt.overLimit),
});

export const mapHistory = (entry) => ({
    historyId: entry.historyId,
    changedAt: entry.changedAt,
    action: entry.action,
    previousAmount: centsOrNull(entry.previousAmount),
    newAmount: centsOrNull(entry.newAmount),
    previousPaymentMethodId: entry.previousPaymentMethodId,
    previousPaymentMethodName: entry.previousPaymentMethodName,
    newPaymentMethodId: entry.newPaymentMethodId,
    newPaymentMethodName: entry.newPaymentMethodName,
    reason: entry.reason,
    employeeId: entry.employeeId,
    employeeName: entry.employeeName,
    paymentId: entry.paymentId,
    saleId: entry.saleId,
    orderId: entry.orderId,
    customerId: entry.customerId,
    customerName: entry.customerName,
});
