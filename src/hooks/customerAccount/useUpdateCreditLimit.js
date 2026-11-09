import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {useAccountRequest} from "./useAccountRequest.js";
import {customerAccountService} from "../../services/customerAccountService.js";
import {onUpdateCustomer} from "../../stores/slices/customer/customerSlice.js";
import {fromCents} from "../../utils/money.js";

// El PATCH devuelve el estado de cuenta, no el cliente: el límite nuevo se refleja también en la lista de
// clientes del store para que la tabla de Clientes y el POS lo vean sin recargar.
export const useUpdateCreditLimit = () => {
    const {runRequest} = useAccountRequest();
    const customers = useSelector((state) => state.customer.customers);
    const dispatch = useDispatch();

    const updateCreditLimit = useCallback(async (customerId, creditLimit) => {
        const outcome = await runRequest(() => customerAccountService.updateCreditLimit(customerId, creditLimit));
        if (outcome.ok) {
            const customer = customers.find((item) => item.id === customerId);
            if (customer) {
                dispatch(onUpdateCustomer({...customer, creditLimit: fromCents(creditLimit)}));
            }
            toast.success('Límite de crédito actualizado.');
        }
        return outcome;
    }, [runRequest, customers, dispatch]);

    return {updateCreditLimit};
};
