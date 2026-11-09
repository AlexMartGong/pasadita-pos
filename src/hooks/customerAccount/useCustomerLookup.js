import {useCallback, useEffect, useEffectEvent} from "react";
import {useCustomer} from "../customer/useCustomer.js";

// Clientes del store (de ahí sale `walkIn`, que el estado de cuenta no trae). Si nadie los ha cargado aún,
// los pide una vez. `handleGetCustomers` cambia en cada render (depende de `handleApiError`, que depende de un
// `handlerLogout` sin memoizar), así que va en un effect event y no en las dependencias.
export const useCustomerLookup = () => {
    const {customers, handleGetCustomers} = useCustomer();
    const isEmpty = customers.length === 0;
    const loadCustomers = useEffectEvent(() => handleGetCustomers());

    useEffect(() => {
        if (isEmpty) loadCustomers();
    }, [isEmpty]);

    const findCustomer = useCallback(
        (customerId) => customers.find((customer) => customer.id === customerId) ?? null,
        [customers]
    );

    return {customers, findCustomer};
};
