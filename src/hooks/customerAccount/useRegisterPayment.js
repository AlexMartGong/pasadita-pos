import {useCallback} from "react";
import {useAccountRequest} from "./useAccountRequest.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Abono en tienda (modo `account`, a las notas más viejas) o a una nota específica (modo `note`, ADMIN).
export const useRegisterPayment = () => {
    const {runRequest} = useAccountRequest();

    const registerPayment = useCallback(({mode, customerId, saleId, amount, paymentMethodId, notes, clientRequestId}) => (
        runRequest(() => {
            const body = {amount, paymentMethodId, notes, clientRequestId};
            return mode === 'note'
                ? customerAccountService.registerSalePayment(saleId, body)
                : customerAccountService.registerAccountPayment(customerId, body);
        })
    ), [runRequest]);

    return {registerPayment};
};
