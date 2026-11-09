import {Box, Chip, IconButton, Tooltip, Typography} from '@mui/material';
import {BlockOutlined, EditOutlined, HistoryOutlined} from '@mui/icons-material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {formatDate} from '../../utils/formatters.js';

// Un abono con sus acciones. `editable` ya trae calculadas las reglas del backend (activo, sin factura
// timbrada y, para no ADMIN, suyo y del mismo día): la UI no las repite. Cancelar es solo de ADMIN.
export const PaymentRow = ({payment, isAdmin, onEdit, onCancel, onHistory}) => {
    const cancelled = payment.status === 'CANCELADO';

    return (
        <Box sx={customerAccountStyles.paymentRow}>
            <Box sx={customerAccountStyles.paymentMeta}>
                <Typography variant="body2" sx={{fontWeight: 600}}>
                    {formatDate(payment.datetime)} · {payment.paymentMethodName}
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block'}}>
                    Registró {payment.employeeName}
                    {payment.notes ? ` · ${payment.notes}` : ''}
                </Typography>
            </Box>

            <Box sx={customerAccountStyles.paymentAmountBlock}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap'}}>
                    {payment.modified && <Chip label="Editado" size="small" color="info" variant="outlined"/>}
                    {cancelled && <Chip label="Cancelado" size="small" color="error" variant="outlined"/>}
                    <Typography sx={{
                        ...customerAccountStyles.amount,
                        fontSize: '1.05rem',
                        ...(cancelled && customerAccountStyles.cancelledAmount),
                    }}>
                        {formatMoney(payment.amount)}
                    </Typography>
                </Box>

                <Box sx={customerAccountStyles.paymentActions}>
                    {payment.editable && (
                        <Tooltip title="Editar abono">
                            <IconButton aria-label="Editar abono" color="primary" onClick={() => onEdit(payment)}>
                                <EditOutlined/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {isAdmin && payment.editable && (
                        <Tooltip title="Cancelar abono">
                            <IconButton aria-label="Cancelar abono" color="error" onClick={() => onCancel(payment)}>
                                <BlockOutlined/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Historial del abono">
                        <IconButton aria-label="Historial del abono" onClick={() => onHistory(payment)}>
                            <HistoryOutlined/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};
