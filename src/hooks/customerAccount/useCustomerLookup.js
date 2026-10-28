import {useCallback, useEffect} from "react";
import {useCustomer} from "../customer/useCustomer.js";

// Clientes del store (de ahí sale `walkIn`, que el estado de cuenta no trae). Si nadie los ha cargado aún,
// los pide una vez.
export const useCustomerLookup = () => {
    const {customers, handleGetCustomers} = useCustomer();
    const isEmpty = customers.length === 0;

    useEffect(() => {
        if (isEmpty) handleGetCustomers();
    }, [isEmpty, handleGetCustomers]);

    const findCustomer = useCallback(
        (customerId) => customers.find((customer) => customer.id === customerId) ?? null,
        [customers]
    );

    return {customers, findCustomer};
};
