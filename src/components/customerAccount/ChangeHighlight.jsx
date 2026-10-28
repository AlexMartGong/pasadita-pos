import {Box, Typography} from '@mui/material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';

// "Cambio a entregar" en grande: es lo que el repartidor o el cajero tiene que leer de un vistazo.
export const ChangeHighlight = ({change}) => (
    <Box sx={customerAccountStyles.changeBox} role="status">
        <Typography sx={customerAccountStyles.changeLabel}>Cambio a entregar</Typography>
        <Typography variant="h3" component="p" sx={customerAccountStyles.changeValue}>
            {formatMoney(change)}
        </Typography>
    </Box>
);
