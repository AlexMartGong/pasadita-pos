import {Chip} from '@mui/material';
import {formatMoney} from '../../utils/money.js';

const ORDER_STATUS = {
    ACTIVO: {label: 'Pagado', color: 'success'},
    PENDIENTE: {label: 'Con saldo', color: 'warning'},
    CANCELADO: {label: 'Cancelado', color: 'error'},
};

// Estado de un pedido para la UI. `balance` (centavos) solo se muestra en PENDIENTE.
export const OrderStatusChip = ({status, balance = 0}) => {
    const config = ORDER_STATUS[status] ?? {label: status, color: 'default'};
    const label = status === 'PENDIENTE' && balance > 0 ? `${config.label} · ${formatMoney(balance)}` : config.label;

    return (
        <Chip
            label={label}
            color={config.color}
            variant={status === 'PENDIENTE' ? 'filled' : 'outlined'}
            size="small"
            sx={{fontVariantNumeric: 'tabular-nums', fontWeight: 600}}
        />
    );
};
