import {Box, Typography} from '@mui/material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {ChangeHighlight} from './ChangeHighlight.jsx';

// Reparto de un monto entre notas pendientes (de la más vieja a la más nueva) y el cambio que sobra.
export const AllocationPreview = ({title, allocations, change, showChange = true}) => (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <Box sx={customerAccountStyles.summaryBox}>
            <Typography sx={{...customerAccountStyles.sectionLabel, mb: 1}}>{title}</Typography>
            {allocations.length === 0 ? (
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    No hay notas pendientes a las que abonar.
                </Typography>
            ) : (
                <Box component="ul" sx={customerAccountStyles.allocationList}>
                    {allocations.map((allocation) => (
                        <Box component="li" key={allocation.saleId} sx={customerAccountStyles.allocationItem}>
                            <Typography variant="body2">
                                Nota #{allocation.saleId}
                                <Box component="span" sx={{color: 'text.secondary'}}>
                                    {' · '}queda {formatMoney(allocation.remainingBalance)}
                                </Box>
                            </Typography>
                            <Typography variant="body2" sx={customerAccountStyles.amount}>
                                {formatMoney(allocation.amount)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
        {showChange && <ChangeHighlight change={change}/>}
    </Box>
);
