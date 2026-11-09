import {Box, Typography} from '@mui/material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';

// Renglones etiqueta / valor del resumen de "Revisar" y "Resultado".
export const SummaryRows = ({rows}) => (
    <Box sx={customerAccountStyles.summaryBox}>
        {rows.filter(Boolean).map(({label, value, emphasis}) => (
            <Box key={label} sx={customerAccountStyles.summaryRow}>
                <Typography sx={customerAccountStyles.summaryLabel}>{label}</Typography>
                <Typography
                    component="div"
                    sx={{
                        ...customerAccountStyles.amount,
                        textAlign: 'right',
                        ...(emphasis && {fontWeight: 800}),
                    }}
                >
                    {value}
                </Typography>
            </Box>
        ))}
    </Box>
);
