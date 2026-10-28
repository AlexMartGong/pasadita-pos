import {useState} from 'react';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {RequestQuoteOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {PaymentRow} from './PaymentRow.jsx';
import {PaymentActionDialogs} from './PaymentActionDialogs.jsx';
import {SummaryRows} from './SummaryRows.jsx';
import {useSalePayments} from '../../hooks/customerAccount/useSalePayments.js';
import {useAuth} from '../../auth/hooks/useAuth.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {noteBalance} from '../../utils/paymentPreview.js';

// 5.4 Abonos de una nota, activos y cancelados (tachados), con sus acciones según `editable` y el rol.
// `noteTotal` (centavos) es opcional: si no se pasa, se lee de la nota.
export const SalePaymentsDialog = ({saleId, orderId, noteTotal = null, onClose, onChanged}) => {
    const {isAdmin} = useAuth();
    const {payments, noteTotal: total, loading, reload} = useSalePayments(saleId, {noteTotal});
    const [paymentAction, setPaymentAction] = useState(null);

    const openAction = (type) => (payment) => setPaymentAction({type, payment, saleId, noteTotal: total, payments});

    const handleChanged = () => {
        reload();
        onChanged?.();
    };

    const isLoaded = total !== null;
    const balance = isLoaded ? noteBalance({noteTotal: total, payments}) : 0;

    return (
        <>
            <AccountDialog
                title={`Abonos de la nota #${saleId}`}
                subtitle={orderId ? `Pedido #${orderId}` : undefined}
                icon={RequestQuoteOutlined}
                maxWidth="md"
                onClose={onClose}
                actions={<Button onClick={onClose} variant="contained" sx={customerAccountStyles.touchButton}>Cerrar</Button>}
            >
                {!isLoaded && loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 3}}><CircularProgress size={28}/></Box>
                ) : isLoaded && (
                    <>
                        <SummaryRows rows={[
                            {label: 'Total de la nota', value: formatMoney(total)},
                            {label: 'Abonado', value: formatMoney(total - balance)},
                            {label: 'Saldo', value: formatMoney(balance), emphasis: true},
                        ]}/>
                        {payments.length === 0 ? (
                            <Typography sx={customerAccountStyles.emptyState}>Esta nota no tiene abonos.</Typography>
                        ) : (
                            <Box>
                                {payments.map((payment) => (
                                    <PaymentRow
                                        key={payment.paymentId}
                                        payment={payment}
                                        isAdmin={isAdmin}
                                        onEdit={openAction('edit')}
                                        onCancel={openAction('cancel')}
                                        onHistory={openAction('history')}
                                    />
                                ))}
                            </Box>
                        )}
                    </>
                )}
            </AccountDialog>

            <PaymentActionDialogs
                action={paymentAction}
                onClose={() => setPaymentAction(null)}
                onChanged={handleChanged}
            />
        </>
    );
};
