import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {HistoryOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {PaymentActionChip} from './PaymentActionChip.jsx';
import {usePaymentHistory} from '../../hooks/customerAccount/usePaymentHistory.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {formatDate} from '../../utils/formatters.js';
import {
    describeHistoryAmount, describeHistoryMethod, PAYMENT_HISTORY_ACTIONS
} from '../../utils/paymentHistoryActions.js';

// 5.7 Historial de un abono: línea de tiempo del más viejo al más reciente.
export const PaymentHistoryDialog = ({payment, onClose}) => {
    const {history, loading} = usePaymentHistory(payment.paymentId);

    return (
        <AccountDialog
            title="Historial del abono"
            subtitle={`Abono de ${formatMoney(payment.amount)} · ${formatDate(payment.datetime)}`}
            icon={HistoryOutlined}
            onClose={onClose}
            actions={<Button onClick={onClose} variant="contained" sx={customerAccountStyles.touchButton}>Cerrar</Button>}
        >
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 3}}><CircularProgress size={28}/></Box>
            ) : history.length === 0 ? (
                <Typography sx={customerAccountStyles.emptyState}>Sin movimientos registrados.</Typography>
            ) : (
                <Box component="ol" sx={{...customerAccountStyles.timeline, m: 0, listStyle: 'none'}}>
                    {history.map((entry) => (
                        <Box component="li" key={entry.historyId} sx={customerAccountStyles.timelineItem}>
                            <Box sx={customerAccountStyles.timelineDot(
                                PAYMENT_HISTORY_ACTIONS[entry.action]?.dot ?? '#9e9e9e'
                            )}/>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                                <PaymentActionChip action={entry.action}/>
                                <Typography variant="caption" sx={{color: 'text.secondary'}}>
                                    {formatDate(entry.changedAt)}
                                </Typography>
                            </Box>
                            <Typography sx={{...customerAccountStyles.amount, mt: 0.75}}>
                                {describeHistoryAmount(entry)}
                            </Typography>
                            <Typography variant="body2">{describeHistoryMethod(entry)}</Typography>
                            {entry.reason && (
                                <Typography variant="body2" sx={{color: 'text.secondary', fontStyle: 'italic'}}>
                                    “{entry.reason}”
                                </Typography>
                            )}
                            <Typography variant="caption" sx={{color: 'text.secondary'}}>
                                {entry.employeeName}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </AccountDialog>
    );
};
