import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useAccountRequest} from "./useAccountRequest.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Los pedidos no traen customerId: se lee de su nota para abrir el estado de cuenta del cliente.
export const useSaleCustomer = () => {
    const {runRequest} = useAccountRequest();
    const navigate = useNavigate();

    const openCustomerAccountForSale = useCallback(async (saleId) => {
        const outcome = await runRequest(() => customerAccountService.getNoteInfo(saleId));
        if (outcome.ok && outcome.data.customerId) {
            navigate(`/customers/${outcome.data.customerId}/account`);
        }
    }, [runRequest, navigate]);

    return {openCustomerAccountForSale};
};
