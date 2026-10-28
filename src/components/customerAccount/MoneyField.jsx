import {InputAdornment, TextField} from '@mui/material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';

// Campo de monto: texto con teclado decimal en celular (U8). `type="number"` rompería la coma decimal.
export const MoneyField = ({label, value, onChange, error, helperText, autoFocus = false, disabled = false}) => (
    <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={Boolean(error)}
        helperText={error || helperText}
        autoFocus={autoFocus}
        disabled={disabled}
        slotProps={{
            input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                sx: customerAccountStyles.amountInput,
            },
            htmlInput: {inputMode: 'decimal', autoComplete: 'off', 'data-autofocus': autoFocus ? 'true' : undefined},
        }}
    />
);
