import {useMemo} from "react";
import {toCents} from "../../utils/money.js";

// Tarjetas de Pedidos, calculadas de la lista del día en centavos. No se usa el totalAmount del backend: solo
// suma los pedidos pagados y deja fuera lo ya abonado en los pedidos con saldo.
export const useDeliveryOrderStats = (deliveryOrders) => useMemo(() => {
    const notCancelled = (deliveryOrders || []).filter(order => order.status !== 'CANCELADO');
    return {
        soldToday: notCancelled.reduce((sum, order) => sum + toCents(order.total), 0),
        receivable: (deliveryOrders || []).reduce((sum, order) => sum + toCents(order.balance), 0),
    };
}, [deliveryOrders]);
