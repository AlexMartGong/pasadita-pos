import {useAccountQuery} from "./useAccountQuery.js";
import {salePaymentService} from "../../services/salePaymentService.js";

// Historial de un abono, del cambio más viejo al más reciente.
export const usePaymentHistory = (paymentId) => {
    const {data, loading} = useAccountQuery(
        paymentId ? `payment-history:${paymentId}` : null,
        () => salePaymentService.getPaymentHistory(paymentId)
    );

    return {history: data ?? [], loading};
};
