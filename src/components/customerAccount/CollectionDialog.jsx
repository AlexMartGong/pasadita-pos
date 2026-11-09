import {useState} from 'react';
import {Alert, Box, Button, CircularProgress, Typography} from '@mui/material';
import {PaymentsOutlined} from '@mui/icons-material';
import {AccountDialog} from './AccountDialog.jsx';
import {MoneyField} from './MoneyField.jsx';
import {PaymentMethodSelect} from './PaymentMethodSelect.jsx';
import {AllocationPreview} from './AllocationPreview.jsx';
import {SummaryRows} from './SummaryRows.jsx';
import {PaymentResultSummary} from './PaymentResultSummary.jsx';
import {useCollectionContext} from '../../hooks/customerAccount/useCollectionContext.js';
import {useCustomerLookup} from '../../hooks/customerAccount/useCustomerLookup.js';
import {useRegisterCollection} from '../../hooks/customerAccount/useRegisterCollection.js';
import {useMoneyDialogFlow} from '../../hooks/customerAccount/useMoneyDialogFlow.js';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';
import {formatMoney, parseMoneyInput, toCents} from '../../utils/money.js';
import {previewCollection} from '../../utils/paymentPreview.js';
import {CASH_PAYMENT_METHOD_ID, paymentMethodLabel} from '../../utils/paymentMethods.js';

const WALK_IN_SHORTFALL_MESSAGE =
    'Público en general no puede quedar con saldo. Asigna el pedido a un cliente registrado.';

const CollectionPreview = ({preview}) => {
    if (!preview) return null;

    if (preview.kind === 'exact') {
        return <Alert severity="info">Si pagó exacto, no registres nada.</Alert>;
    }

    if (preview.kind === 'shortfall') {
        return (
            <>
                <Alert severity="warning">
                    <Typography sx={{fontWeight: 700}}>Quedan {formatMoney(preview.pending)} pendientes</Typography>
                    Deuda total: {formatMoney(preview.newDebt)} de {formatMoney(preview.creditLimit)}
                </Alert>
                {preview.overLimit && (
                    <Alert severity="error">Este cliente rebasará su límite de crédito. Avísale.</Alert>
                )}
            </>
        );
    }

    return (
        <>
            <Alert severity="success">
                Pedido pagado. Excedente de {formatMoney(preview.surplus)}.
            </Alert>
            <AllocationPreview
                title="El excedente se abona a"
                allocations={preview.allocations}
                change={preview.change}
            />
        </>
    );
};

// 5.1 Registrar cobro de un pedido ACTIVO sin abonos: Captura → Revisar → Resultado.
export const CollectionDialog = ({order, onClose, onCompleted}) => {
    const orderTotal = toCents(order.total);
    const {customerId, account, loading} = useCollectionContext(order.saleId);
    const {findCustomer} = useCustomerLookup();
    const {registerCollection} = useRegisterCollection();
    const flow = useMoneyDialogFlow();
    const [amountText, setAmountText] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState(CASH_PAYMENT_METHOD_ID);

    const isWalkIn = Boolean(customerId && findCustomer(customerId)?.walkIn);
    const {cents: amount, valid} = parseMoneyInput(amountText);
    const preview = valid && account
        ? previewCollection({orderTotal, amount, saleId: order.saleId, account})
        : null;
    const walkInShortfall = isWalkIn && preview?.kind === 'shortfall';
    const requiresMethod = valid && amount > 0;

    const amountError = flow.fieldErrors.amountReceived
        || (amountText !== '' && !valid ? 'Captura un monto válido, con hasta 2 decimales.' : null);
    const methodError = flow.fieldErrors.paymentMethodId
        || (requiresMethod && !paymentMethodId ? 'Elige el método de pago.' : null);
    const canReview = Boolean(preview) && preview.kind !== 'exact' && !walkInShortfall && !amountError && !methodError;

    const handleAmountChange = (text) => {
        setAmountText(text);
        flow.clearFieldError('amountReceived');
    };

    const handleSubmit = async () => {
        const outcome = await flow.submit(({clientRequestId, isRetry}) => registerCollection({
            orderId: order.id,
            saleId: order.saleId,
            customerId,
            amountReceived: amount,
            paymentMethodId,
            clientRequestId,
            isRetry,
        }));
        if (outcome.ok) onCompleted?.();
    };

    const subtitle = `${order.customerName ?? ''} · Total ${formatMoney(orderTotal)}`;

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
                    {flow.submitting ? 'Guardando...' : 'Confirmar cobro'}
                </Button>
            </>
        ),
        result: (
            <Button onClick={onClose} variant="contained" sx={customerAccountStyles.touchButton}>Cerrar</Button>
        ),
    }[flow.step];

    return (
        <AccountDialog
            title={`Registrar cobro · Pedido #${order.id}`}
            subtitle={subtitle}
            icon={PaymentsOutlined}
            busy={flow.submitting}
            networkError={flow.networkError}
            onRetry={handleSubmit}
            onClose={onClose}
            actions={actions}
        >
            {flow.step === 'capture' && (
                <>
                    {loading && !account ? (
                        <Box sx={{display: 'flex', justifyContent: 'center', py: 2}}><CircularProgress size={28}/></Box>
                    ) : account && !isWalkIn && (
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            {account.creditLimit > 0
                                ? `Debe ${formatMoney(account.totalDebt)} de un límite de ${formatMoney(account.creditLimit)}`
                                : `Debe ${formatMoney(account.totalDebt)} · sin crédito`}
                        </Typography>
                    )}

                    <MoneyField
                        label="Monto que deja el cliente"
                        value={amountText}
                        onChange={handleAmountChange}
                        error={amountError}
                        helperText="Lo que deja como pago, no el billete con el que paga."
                        autoFocus
                    />
                    <Button variant="outlined" color="warning" onClick={() => handleAmountChange('0')}
                            sx={customerAccountStyles.quickButton}>
                        No pagó nada
                    </Button>
                    <PaymentMethodSelect
                        value={paymentMethodId}
                        onChange={setPaymentMethodId}
                        error={methodError}
                        disabled={!requiresMethod}
                    />

                    {walkInShortfall
                        ? <Alert severity="error">{WALK_IN_SHORTFALL_MESSAGE}</Alert>
                        : <CollectionPreview preview={preview}/>}
                </>
            )}

            {flow.step === 'review' && preview && (
                <>
                    <Typography sx={customerAccountStyles.sectionLabel}>Revisa antes de guardar</Typography>
                    <SummaryRows rows={[
                        {label: 'Pedido', value: `#${order.id} · Nota #${order.saleId}`},
                        {label: 'Total del pedido', value: formatMoney(orderTotal)},
                        {label: 'Deja el cliente', value: formatMoney(amount), emphasis: true},
                        amount > 0 && {label: 'Método de pago', value: paymentMethodLabel(paymentMethodId)},
                    ]}/>
                    <CollectionPreview preview={preview}/>
                </>
            )}

            {flow.step === 'result' && flow.result && (
                <PaymentResultSummary result={flow.result} ownSaleId={order.saleId}/>
            )}
        </AccountDialog>
    );
};
