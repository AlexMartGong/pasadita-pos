import {useCallback} from "react";
import {toast} from "react-toastify";
import {useAccountRequest} from "./useAccountRequest.js";
import {salePaymentService} from "../../services/salePaymentService.js";

export const useCancelPayment = () => {
    const {runRequest} = useAccountRequest();

    const cancelPayment = useCallback(async (paymentId, reason) => {
        const outcome = await runRequest(() => salePaymentService.cancelPayment(paymentId, reason));
        if (outcome.ok) toast.success('Abono cancelado.');
        return outcome;
    }, [runRequest]);

    return {cancelPayment};
};
