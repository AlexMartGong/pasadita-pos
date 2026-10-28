import {Chip} from '@mui/material';
import {AccountBalanceWalletOutlined} from '@mui/icons-material';
import {formatMoney} from '../../utils/money.js';

// "Debe $X de $Y": deuda contra límite de crédito (centavos). En rojo cuando ya alcanzó el límite.
export const CustomerCreditChip = ({debt, creditLimit, size = 'small'}) => {
    const reachedLimit = debt > 0 && debt >= creditLimit;
    const label = creditLimit > 0
        ? `Debe ${formatMoney(debt)} de ${formatMoney(creditLimit)}`
        : `Debe ${formatMoney(debt)} · sin crédito`;

    return (
        <Chip
            icon={<AccountBalanceWalletOutlined/>}
            label={label}
            color={reachedLimit ? 'error' : debt > 0 ? 'warning' : 'default'}
            variant={reachedLimit ? 'filled' : 'outlined'}
            size={size}
            sx={{fontVariantNumeric: 'tabular-nums', fontWeight: 600}}
        />
    );
};
