import {useCustomerAccount} from "./useCustomerAccount.js";

// Crédito del cliente elegido en el POS. Solo se consulta cuando `enabled` (pedido a domicilio nuevo para un
// cliente registrado); al cambiar de cliente se descarta la consulta anterior.
export const useCustomerCredit = (customerId, enabled) => {
    const {account, loading} = useCustomerAccount(enabled ? customerId : null);

    return {
        credit: account ? {debt: account.totalDebt, creditLimit: account.creditLimit} : null,
        loading,
    };
};
