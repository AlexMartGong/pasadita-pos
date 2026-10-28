import {MenuItem, TextField} from '@mui/material';
import {PAYMENT_METHODS} from '../../utils/paymentMethods.js';

export const PaymentMethodSelect = ({value, onChange, error, disabled = false}) => (
    <TextField
        select
        fullWidth
        label="Método de pago"
        value={value ?? ''}
        onChange={(event) => onChange(Number(event.target.value))}
        error={Boolean(error)}
        helperText={error}
        disabled={disabled}
    >
        {PAYMENT_METHODS.map((method) => (
            <MenuItem key={method.value} value={method.value} sx={{minHeight: 48}}>
                {method.label}
            </MenuItem>
        ))}
    </TextField>
);
