import {useMemo} from "react";
import {useAccountQuery} from "./useAccountQuery.js";
import {customerAccountService} from "../../services/customerAccountService.js";

// Clientes con saldo, ya ordenados por el backend de mayor a menor deuda.
export const useCustomerDebts = () => {
    const {data, loading, reload} = useAccountQuery('customer-debts', () => customerAccountService.getCustomerDebts());
    const debts = useMemo(() => data ?? [], [data]);
    const totalReceivable = useMemo(() => debts.reduce((sum, debt) => sum + debt.totalDebt, 0), [debts]);

    return {debts, totalReceivable, loading, reload};
};
