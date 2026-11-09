import {useAccountQuery} from "./useAccountQuery.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Estado de cuenta de un cliente: deuda, límite y notas pendientes con sus abonos activos.
export const useCustomerAccount = (customerId) => {
    const {data, loading, failed, reload} = useAccountQuery(
        customerId ? `account:${customerId}` : null,
        () => customerAccountService.getAccount(customerId)
    );

    return {account: data, loading, failed, reload};
};
