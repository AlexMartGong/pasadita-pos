import {Chip} from '@mui/material';
import {PAYMENT_HISTORY_ACTIONS} from '../../utils/paymentHistoryActions.js';

export const PaymentActionChip = ({action}) => {
    const config = PAYMENT_HISTORY_ACTIONS[action] ?? {label: action, color: 'default'};
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{fontWeight: 600}}/>;
};
