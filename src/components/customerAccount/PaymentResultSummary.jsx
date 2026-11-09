import {Alert} from '@mui/material';
import {formatMoney} from '../../utils/money.js';
import {SummaryRows} from './SummaryRows.jsx';
import {OrderStatusChip} from './OrderStatusChip.jsx';
import {AllocationPreview} from './AllocationPreview.jsx';
import {ChangeHighlight} from './ChangeHighlight.jsx';

// Resultado de un cobro o abono, armado SIEMPRE con la respuesta del backend (no con la vista previa).
// En un cobro, `appliedPayments` trae primero la propia nota del pedido; se excluye por saleId y no por
// posición porque un cobro de $0 no genera ningún abono.
export const PaymentResultSummary = ({result, ownSaleId = null, showChange = true}) => {
    const otherNotes = result.appliedPayments.filter((applied) => applied.saleId !== ownSaleId);

    return (
        <>
            <Alert severity="success">Operación registrada.</Alert>
            <SummaryRows rows={[
                result.orderStatus && {
                    label: 'Estado del pedido',
                    value: <OrderStatusChip status={result.orderStatus} balance={result.saleBalance ?? 0}/>,
                },
                result.saleBalance !== null && {label: 'Saldo de la nota', value: formatMoney(result.saleBalance)},
                {label: 'Deuda total del cliente', value: formatMoney(result.customerDebt), emphasis: true},
                {
                    label: 'Límite de crédito',
                    value: result.creditLimit > 0 ? formatMoney(result.creditLimit) : 'Sin crédito',
                },
                showChange && result.change === 0 && {label: 'Cambio a entregar', value: formatMoney(0)},
            ]}/>
            {otherNotes.length > 0 && (
                <AllocationPreview
                    title={ownSaleId ? 'Excedente aplicado a otras notas' : 'Abono aplicado'}
                    allocations={otherNotes}
                    change={result.change}
                    showChange={false}
                />
            )}
            {showChange && result.change > 0 && <ChangeHighlight change={result.change}/>}
            {result.overLimit && (
                <Alert severity="error" variant="filled">
                    Este cliente rebasó su límite de crédito. Avísale.
                </Alert>
            )}
        </>
    );
};
