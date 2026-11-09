import {useState} from 'react';
import {Alert, Button, TextField, Typography} from '@mui/material';
import {SavingsOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {MoneyField} from './MoneyField.jsx';
import {PaymentMethodSelect} from './PaymentMethodSelect.jsx';
import {AllocationPreview} from './AllocationPreview.jsx';
import {SummaryRows} from './SummaryRows.jsx';
import {PaymentResultSummary} from './PaymentResultSummary.jsx';
import {useRegisterPayment} from '../../hooks/customerAccount/useRegisterPayment.js';
import {useMoneyDialogFlow} from '../../hooks/customerAccount/useMoneyDialogFlow.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney, parseMoneyInput} from '../../utils/money.js';
import {previewAccountPayment, previewNotePayment} from '../../utils/paymentPreview.js';
import {CASH_PAYMENT_METHOD_ID, paymentMethodLabel} from '../../utils/paymentMethods.js';

const NOTES_MAX_LENGTH = 200;

const PaymentPreview = ({mode, preview, note}) => {
    if (!preview) return null;

    if (mode === 'note') {
        return preview.exceedsBalance
            ? <Alert severity="error">El abono no puede ser mayor que el saldo de la nota ({formatMoney(note.balance)}).</Alert>
            : <Alert severity="info">El saldo de la nota pasa de {formatMoney(note.balance)} a {formatMoney(preview.newBalance)}.</Alert>;
    }

    return (
        <>
            <AllocationPreview title="Se abona a" allocations={preview.allocations} change={preview.change}/>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                Deuda después del abono: {formatMoney(preview.newDebt)}
            </Typography>
        </>
    );
};

// 5.3 Registrar abono. Modo `account`: abono en tienda a las notas más viejas, con cambio. Modo `note`
// (ADMIN, conciliación): la nota queda fija, el tope es su saldo y no hay cambio.
export const PaymentDialog = ({mode = 'account', customerId, customerName, account, note, onClose, onCompleted}) => {
    const {registerPayment} = useRegisterPayment();
    const flow = useMoneyDialogFlow();
    const [amountText, setAmountText] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState(CASH_PAYMENT_METHOD_ID);
    const [notes, setNotes] = useState('');

    const {cents: amount, valid} = parseMoneyInput(amountText);
    const hasAmount = valid && amount >= 1;
    const preview = hasAmount
        ? (mode === 'note'
            ? previewNotePayment({amount, noteBalance: note.balance})
            : previewAccountPayment({amount, account}))
        : null;

    const amountError = flow.fieldErrors.amount
        || (amountText !== '' && !valid ? 'Captura un monto válido, con hasta 2 decimales.' : null)
        || (valid && amountText !== '' && amount < 1 ? 'El abono debe ser de al menos $0.01.' : null);
    const notesError = flow.fieldErrors.notes
        || (notes.length > NOTES_MAX_LENGTH ? `Máximo ${NOTES_MAX_LENGTH} caracteres.` : null);
    const canReview = hasAmount && !amountError && !notesError && Boolean(paymentMethodId)
        && !(mode === 'note' && preview?.exceedsBalance);

    const handleSubmit = async () => {
        const outcome = await flow.submit(({clientRequestId}) => registerPayment({
            mode,
            customerId,
            saleId: note?.saleId,
            amount,
            paymentMethodId,
            notes: notes.trim(),
            clientRequestId,
        }));
        if (outcome.ok) onCompleted?.();
    };

    const title = mode === 'note' ? `Abonar a la nota #${note.saleId}` : 'Registrar abono';
    const subtitle = mode === 'note'
        ? `${customerName} · Saldo ${formatMoney(note.balance)}`
        : `${customerName} · Debe ${formatMoney(account?.totalDebt ?? 0)}`;

    const actions = {
        capture: (
            <>
                <Button onClick={onClose} variant="outlined" sx={customerAccountStyles.touchButton}>Cancelar</Button>
                <Button onClick={flow.goToReview} variant="contained" disabled={!canReview}
                        sx={customerAccountStyles.touchButton}>
                    Revisar
                </Button>
            </>
        ),
        review: (
            <>
                <Button onClick={flow.backToCapture} variant="outlined" disabled={flow.submitting}
                        sx={customerAccountStyles.touchButton}>
                    Corregir
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="success" disabled={flow.submitting}
                        sx={customerAccountStyles.touchButton}>
                    {flow.submitting ? 'Guardando...' : 'Confirmar abono'}
                </Button>
            </>
        ),
        result: (
            <Button onClick={onClose} variant="contained" sx={customerAccountStyles.touchButton}>Cerrar</Button>
        ),
    }[flow.step];

    return (
        <AccountDialog
            title={title}
            subtitle={subtitle}
            icon={SavingsOutlined}
            busy={flow.submitting}
            networkError={flow.networkError}
            onRetry={handleSubmit}
            onClose={onClose}
            actions={actions}
        >
            {flow.step === 'capture' && (
                <>
                    <MoneyField
                        label="Monto del abono"
                        value={amountText}
                        onChange={(text) => {
                            setAmountText(text);
                            flow.clearFieldError('amount');
                        }}
                        error={amountError}
                        helperText={mode === 'note' ? `Máximo ${formatMoney(note.balance)}` : undefined}
                        autoFocus
                    />
                    <PaymentMethodSelect
                        value={paymentMethodId}
                        onChange={setPaymentMethodId}
                        error={flow.fieldErrors.paymentMethodId}
                    />
                    <TextField
                        fullWidth
                        label="Notas (opcional)"
                        value={notes}
                        onChange={(event) => {
                            setNotes(event.target.value);
                            flow.clearFieldError('notes');
                        }}
                        error={Boolean(notesError)}
                        helperText={notesError || `${notes.length}/${NOTES_MAX_LENGTH}`}
                        multiline
                        minRows={2}
                    />
                    <PaymentPreview mode={mode} preview={preview} note={note}/>
                </>
            )}

            {flow.step === 'review' && (
                <>
                    <Typography sx={customerAccountStyles.sectionLabel}>Revisa antes de guardar</Typography>
                    <SummaryRows rows={[
                        {label: 'Cliente', value: customerName},
                        mode === 'note' && {label: 'Nota', value: `#${note.saleId} · Pedido #${note.orderId}`},
                        {label: 'Monto del abono', value: formatMoney(amount), emphasis: true},
                        {label: 'Método de pago', value: paymentMethodLabel(paymentMethodId)},
                        notes.trim() && {label: 'Notas', value: notes.trim()},
                    ]}/>
                    <PaymentPreview mode={mode} preview={preview} note={note}/>
                </>
            )}

            {flow.step === 'result' && flow.result && (
                <PaymentResultSummary result={flow.result} showChange={mode === 'account'}/>
            )}
        </AccountDialog>
    );
};
