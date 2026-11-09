import {useState} from 'react';
import {Alert, Button, Typography} from '@mui/material';
import {BlockOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {REASON_MAX_LENGTH, ReasonField} from './ReasonField.jsx';
import {SummaryRows} from './SummaryRows.jsx';
import {useCancelPayment} from '../../hooks/customerAccount/useCancelPayment.js';
import {useMoneyDialogFlow} from '../../hooks/customerAccount/useMoneyDialogFlow.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney} from '../../utils/money.js';
import {formatDate} from '../../utils/formatters.js';
import {previewCancel} from '../../utils/paymentPreview.js';

// 5.6 Cancelar abono (ADMIN): el abono no se borra, queda tachado y la nota se recalcula.
export const CancelPaymentDialog = ({payment, saleId, noteTotal, payments, onClose, onCompleted}) => {
    const {cancelPayment} = useCancelPayment();
    const flow = useMoneyDialogFlow();
    const [reason, setReason] = useState('');

    const preview = previewCancel({noteTotal, payments, paymentId: payment.paymentId});
    const reasonError = flow.fieldErrors.reason
        || (reason.length > REASON_MAX_LENGTH ? `Máximo ${REASON_MAX_LENGTH} caracteres.` : null);
    const canReview = reason.trim() !== '' && !reasonError;

    const handleSubmit = async () => {
        const outcome = await flow.submit(() => cancelPayment(payment.paymentId, reason.trim()));
        if (outcome.ok) {
            onCompleted?.();
            onClose();
        }
    };

    const paymentRows = [
        {label: 'Fecha', value: formatDate(payment.datetime)},
        {label: 'Monto', value: formatMoney(payment.amount), emphasis: true},
        {label: 'Método de pago', value: payment.paymentMethodName},
        {label: 'Registró', value: payment.employeeName},
    ];

    const actions = flow.step === 'capture' ? (
        <>
            <Button onClick={onClose} variant="outlined" sx={customerAccountStyles.touchButton}>Volver</Button>
            <Button onClick={flow.goToReview} variant="contained" color="error" disabled={!canReview}
                    sx={customerAccountStyles.touchButton}>
                Revisar
            </Button>
        </>
    ) : (
        <>
            <Button onClick={flow.backToCapture} variant="outlined" disabled={flow.submitting}
                    sx={customerAccountStyles.touchButton}>
                Corregir
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="error" disabled={flow.submitting}
                    sx={customerAccountStyles.touchButton}>
                {flow.submitting ? 'Cancelando...' : 'Cancelar abono'}
            </Button>
        </>
    );

    return (
        <AccountDialog
            title="Cancelar abono"
            subtitle={`Nota #${saleId}`}
            icon={BlockOutlined}
            tone="danger"
            busy={flow.submitting}
            networkError={flow.networkError}
            onRetry={handleSubmit}
            onClose={onClose}
            actions={actions}
        >
            <SummaryRows rows={flow.step === 'review'
                ? [...paymentRows, {label: 'Motivo', value: reason.trim()}]
                : paymentRows}/>
            <Alert severity="warning">
                La nota quedará pendiente con saldo {formatMoney(preview.after)}.
            </Alert>
            {flow.step === 'capture' ? (
                <ReasonField
                    value={reason}
                    onChange={(text) => {
                        setReason(text);
                        flow.clearFieldError('reason');
                    }}
                    error={reasonError}
                />
            ) : (
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    El abono se conserva tachado en el historial y deja de contar para el saldo y la deuda.
                </Typography>
            )}
        </AccountDialog>
    );
};
