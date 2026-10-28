import {TextField} from '@mui/material';

export const REASON_MAX_LENGTH = 200;

// Motivo obligatorio para modificar o cancelar un abono (queda en el historial).
export const ReasonField = ({value, onChange, error}) => (
    <TextField
        fullWidth
        required
        label="Motivo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={Boolean(error)}
        helperText={error || `${value.length}/${REASON_MAX_LENGTH}`}
        multiline
        minRows={2}
    />
);
