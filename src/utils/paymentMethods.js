// El backend no expone un catálogo de métodos de pago: estos ids son los de la tabla `paymentmethods`.
export const PAYMENT_METHODS = [
    {value: 1, label: 'Efectivo'},
    {value: 2, label: 'Transferencia'},
    {value: 3, label: 'Tarjeta de Crédito'},
    {value: 5, label: 'Tarjeta de Débito'},
];

export const CASH_PAYMENT_METHOD_ID = 1;

export const paymentMethodLabel = (id) => PAYMENT_METHODS.find(method => method.value === id)?.label ?? '';
