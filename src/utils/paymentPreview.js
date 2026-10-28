// Vistas previas de cobros y abonos, todo en centavos enteros. Replican el reparto del backend (de la nota
// más vieja a la más nueva) solo para mostrarlo: lo que se muestra como resultado sale siempre de la respuesta.

const ACTIVE_PAYMENT_STATUS = 'APLICADO';

// Reparte `amount` entre las notas (ya ordenadas de la más vieja a la más nueva); lo que sobra es cambio.
export const allocateOldestFirst = (notes, amount) => {
    let remaining = Math.max(amount, 0);
    const allocations = [];
    for (const note of notes) {
        if (remaining <= 0) break;
        if (note.balance <= 0) continue;
        const applied = Math.min(remaining, note.balance);
        allocations.push({saleId: note.saleId, amount: applied, remainingBalance: note.balance - applied});
        remaining -= applied;
    }
    return {allocations, change: remaining};
};

// Cobro de un pedido ACTIVO (su nota aún no cuenta en la deuda). `account` es el estado de cuenta del cliente.
export const previewCollection = ({orderTotal, amount, saleId, account}) => {
    const debt = account?.totalDebt ?? 0;
    const creditLimit = account?.creditLimit ?? 0;

    if (amount === orderTotal) {
        return {kind: 'exact'};
    }

    if (amount < orderTotal) {
        const pending = orderTotal - amount;
        const newDebt = debt + pending;
        return {kind: 'shortfall', pending, newDebt, creditLimit, overLimit: newDebt > creditLimit};
    }

    const surplus = amount - orderTotal;
    const otherNotes = (account?.pendingNotes ?? []).filter(note => note.saleId !== saleId);
    const {allocations, change} = allocateOldestFirst(otherNotes, surplus);
    return {kind: 'surplus', surplus, allocations, change, newDebt: debt - (surplus - change), creditLimit};
};

// Abono en tienda: se aplica a las notas pendientes del cliente, de la más vieja a la más nueva.
export const previewAccountPayment = ({amount, account}) => {
    const debt = account?.totalDebt ?? 0;
    const {allocations, change} = allocateOldestFirst(account?.pendingNotes ?? [], amount);
    return {allocations, change, newDebt: debt - (amount - change)};
};

// Abono a una nota específica (conciliación del ADMIN): tope = saldo de la nota, sin cambio.
export const previewNotePayment = ({amount, noteBalance}) => ({
    exceedsBalance: amount > noteBalance,
    newBalance: Math.max(noteBalance - amount, 0),
});

const activePayments = (payments) => (payments ?? []).filter(payment => payment.status === ACTIVE_PAYMENT_STATUS);

const sumAmounts = (payments) => payments.reduce((sum, payment) => sum + payment.amount, 0);

// Saldo de una nota = total − abonos activos.
export const noteBalance = ({noteTotal, payments}) => noteTotal - sumAmounts(activePayments(payments));

// Tope para editar un abono: total de la nota − la suma de los OTROS abonos activos de esa nota.
export const editCap = ({noteTotal, payments, paymentId}) => (
    noteTotal - sumAmounts(activePayments(payments).filter(payment => payment.paymentId !== paymentId))
);

export const previewEdit = ({noteTotal, payments, paymentId, newAmount}) => {
    const current = (payments ?? []).find(payment => payment.paymentId === paymentId);
    const before = noteBalance({noteTotal, payments});
    const cap = editCap({noteTotal, payments, paymentId});
    return {
        before,
        after: before + (current?.amount ?? 0) - newAmount,
        cap,
        exceedsCap: newAmount > cap,
    };
};

export const previewCancel = ({noteTotal, payments, paymentId}) => {
    const current = (payments ?? []).find(payment => payment.paymentId === paymentId);
    const before = noteBalance({noteTotal, payments});
    const isActive = current?.status === ACTIVE_PAYMENT_STATUS;
    return {before, after: before + (isActive ? current.amount : 0)};
};
