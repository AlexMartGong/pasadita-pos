import {useAccountQuery} from "./useAccountQuery.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Abonos de una nota (activos y cancelados). El endpoint no trae el total de la nota, que hace falta para los
// topes y vistas previas: si quien abre la vista no lo tiene, se pide a la nota.
export const useSalePayments = (saleId, {noteTotal = null} = {}) => {
    const {data, loading, failed, reload} = useAccountQuery(
        saleId ? `sale-payments:${saleId}` : null,
        async () => {
            const [payments, total] = await Promise.all([
                customerAccountService.getSalePayments(saleId),
                noteTotal !== null
                    ? noteTotal
                    : customerAccountService.getNoteInfo(saleId).then((note) => note.total),
            ]);
            return {payments, noteTotal: total};
        }
    );

    return {payments: data?.payments ?? [], noteTotal: data?.noteTotal ?? null, loading, failed, reload};
};
