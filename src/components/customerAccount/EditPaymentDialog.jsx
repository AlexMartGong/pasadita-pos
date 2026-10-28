import {useState} from 'react';
import {Alert, Button, Typography} from '@mui/material';
import {EditOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {MoneyField} from './MoneyField.jsx';
import {PaymentMethodSelect} from './PaymentMethodSelect.jsx';
import {REASON_MAX_LENGTH, ReasonField} from './ReasonField.jsx';
import {SummaryRows} from './SummaryRows.jsx';
import {useModifyPayment} from '../../hooks/customerAccount/useModifyPayment.js';
import {useMoneyDialogFlow} from '../../hooks/customerAccount/useMoneyDialogFlow.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney, parseMoneyInput} from '../../utils/money.js';
import {formatDate} from '../../utils/formatters.js';
import {previewEdit} from '../../utils/paymentPreview.js';
import {paymentMethodLabel} from '../../utils/paymentMethods.js';

const changeText = (previous, next) => (previous === next ? next : `${previous} → ${next}`);

// 5.5 Editar abono (solo si `editable`): monto y/o método, con motivo. Tope = total de la nota − los otros
// abonos activos; para más dinero se registra un abono nuevo.
export const EditPaymentDialog = ({payment, saleId, noteTotal, payments, onClose, onCompleted}) => {
    const {modifyPayment} = useModifyPayment();
    const flow = useMoneyDialogFlow();
    const [amountText, setAmountText] = useState(() => (payment.amount / 100).toFixed(2));
    const [paymentMethodId, setPaymentMethodId] = useState(payment.paymentMethodId);
    const [reason, setReason] = useState('');

    const {cents: amount, valid} = parseMoneyInput(amountText);
    const preview = valid ? previewEdit({noteTotal, payments, paymentId: payment.paymentId, newAmount: amount}) : null;
    const unchanged = valid && amount === payment.amount && paymentMethodId === payment.paymentMethodId;

    const amountError = flow.fieldErrors.amount
        || (!valid ? 'Captura un monto válido, con hasta 2 decimales.' : null)
        || (amount < 1 ? 'El abono debe ser de al menos $0.01.' : null)
        || (preview?.exceedsCap ? 'Para registrar más dinero, registra un abono nuevo.' : null);
    const reasonError = flow.fieldErrors.reason
        || (reason.length > REASON_MAX_LENGTH ? `Máximo ${REASON_MAX_LENGTH} caracteres.` : null);
    const canReview = !unchanged && !amountError && !reasonError && reason.trim() !== '' && Boolean(paymentMethodId);

    const handleSubmit = async () => {
        const outcome = await flow.submit(() => modifyPayment(payment.paymentId, {
            amount,
            paymentMethodId,
            reason: reason.trim(),
        }));
        if (outcome.ok) {
            onCompleted?.();
            onClose();
        }
    };

    const actions = flow.step === 'capture' ? (
        <>
            <Button onClick={onClose} variant="outlined" sx={customerAccountStyles.touchButton}>Cancelar</Button>
            <Button onClick={flow.goToReview} variant="contained" disabled={!canReview}
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
            <Button onClick={handleSubmit} variant="contained" disabled={flow.submitting || unchanged}
                    sx={customerAccountStyles.touchButton}>
                {flow.submitting ? 'Guardando...' : 'Guardar'}
            </Button>
        </>
    );

    return (
        <AccountDialog
            title="Editar abono"
            subtitle={`Nota #${saleId} · ${formatDate(payment.datetime)}`}
            icon={EditOutlined}
            busy={flow.submitting}
            networkError={flow.networkError}
            onRetry={handleSubmit}
            onClose={onClose}
            actions={actions}
        >
            {flow.step === 'capture' && (
                <>
                    <Typography variant="body2" sx={{color: 'text.secondary'}}>
                        Actual: {formatMoney(payment.amount)} en {payment.paymentMethodName}
                    </Typography>
                    <MoneyField
                        label="Monto"
                        value={amountText}
                        onChange={(text) => {
                            setAmountText(text);
                            flow.clearFieldError('amount');
                        }}
                        error={amountError}
                        helperText={preview ? `Máximo ${formatMoney(preview.cap)}` : undefined}
                        autoFocus
                    />
                    <PaymentMethodSelect
                        value={paymentMethodId}
                        onChange={setPaymentMethodId}
                        error={flow.fieldErrors.paymentMethodId}
                    />
                    <ReasonField
                        value={reason}
                        onChange={(text) => {
                            setReason(text);
                            flow.clearFieldError('reason');
                        }}
                        error={reasonError}
                    />
                    {unchanged && <Alert severity="info">No has cambiado el monto ni el método.</Alert>}
                    {preview && !amountError && !unchanged && (
                        <Alert severity="info">
                            El saldo de la nota pasa de {formatMoney(preview.before)} a {formatMoney(preview.after)}.
                        </Alert>
                    )}
                </>
            )}

            {flow.step === 'review' && preview && (
                <>
                    <Typography sx={customerAccountStyles.sectionLabel}>Revisa antes de guardar</Typography>
                    <SummaryRows rows={[
                        {label: 'Monto', value: changeText(formatMoney(payment.amount), formatMoney(amount)), emphasis: true},
                        {
                            label: 'Método de pago',
                            value: changeText(payment.paymentMethodName, paymentMethodLabel(paymentMethodId)),
                        },
                        {label: 'Saldo de la nota', value: changeText(formatMoney(preview.before), formatMoney(preview.after))},
                        {label: 'Motivo', value: reason.trim()},
                    ]}/>
                </>
            )}
        </AccountDialog>
    );
};
