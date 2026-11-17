import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAccountRequest} from "./useAccountRequest.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Abre el estado de cuenta del cliente de un pedido. El pedido ya trae `customerId`; solo si falta se lee de
// su nota.
export const useSaleCustomer = () => {
    const {runRequest} = useAccountRequest();
    const navigate = useNavigate();

    const openCustomerAccountForOrder = useCallback(async (order) => {
        let customerId = order.customerId;
        if (!customerId) {
            const outcome = await runRequest(() => customerAccountService.getNoteInfo(order.saleId));
            customerId = outcome.ok ? outcome.data.customerId : null;
        }
        if (customerId) navigate(`/customers/${customerId}/account`);
    }, [runRequest, navigate]);

    return {openCustomerAccountForOrder};
};
