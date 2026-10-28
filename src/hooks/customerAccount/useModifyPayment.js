import {useCallback} from "react";
import {toast} from "react-toastify";
import {useAccountRequest} from "./useAccountRequest.js";
import {salePaymentService} from "../../services/salePaymentService.js";

export const useModifyPayment = () => {
    const {runRequest} = useAccountRequest();

    const modifyPayment = useCallback(async (paymentId, {amount, paymentMethodId, reason}) => {
        const outcome = await runRequest(() => salePaymentService.modifyPayment(paymentId, {amount, paymentMethodId, reason}));
        if (outcome.ok) toast.success('Abono modificado.');
        return outcome;
    }, [runRequest]);

    return {modifyPayment};
};
