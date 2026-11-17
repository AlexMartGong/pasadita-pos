import {useMemo} from "react";
import {toCents} from "../../utils/money.js";

const sumCents = (orders, field) => orders.reduce((sum, order) => sum + toCents(order[field]), 0);

// Tarjetas de Pedidos, en centavos. La lista trae los pedidos de hoy más los PENDIENTE de días anteriores:
// las cifras "de hoy" solo cuentan los primeros y "Por cobrar" suma todo lo pendiente. No se usa el totalAmount
// del backend: solo suma los pedidos pagados y deja fuera lo ya abonado en los pedidos con saldo.
export const useDeliveryOrderStats = (deliveryOrders) => useMemo(() => {
    const orders = deliveryOrders || [];
    // `!== false`: un pedido sin la bandera cuenta como de hoy.
    const today = orders.filter(order => order.requestedToday !== false);
    const isPending = (order) => order.status === 'PENDIENTE';

    const soldToday = sumCents(today.filter(order => order.status !== 'CANCELADO'), 'total');
    const receivableToday = sumCents(today.filter(isPending), 'balance');

    return {
        ordersToday: today.length,
        soldToday,
        receivableToday,
        collectedToday: soldToday - receivableToday,
        receivable: sumCents(orders.filter(isPending), 'balance'),
    };
}, [deliveryOrders]);
