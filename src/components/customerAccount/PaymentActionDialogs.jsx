import {EditPaymentDialog} from './EditPaymentDialog.jsx';
import {CancelPaymentDialog} from './CancelPaymentDialog.jsx';
import {PaymentHistoryDialog} from './PaymentHistoryDialog.jsx';

// Diálogo de la acción elegida en una fila de abono: {type: 'edit' | 'cancel' | 'history', payment, saleId,
// noteTotal, payments}. Se usa igual desde el estado de cuenta y desde "Abonos de la nota".
export const PaymentActionDialogs = ({action, onClose, onChanged}) => {
    if (!action) return null;

    const props = {
        payment: action.payment,
        saleId: action.saleId,
        noteTotal: action.noteTotal,
        payments: action.payments,
        onClose,
        onCompleted: onChanged,
    };

    if (action.type === 'edit') return <EditPaymentDialog {...props}/>;
    if (action.type === 'cancel') return <CancelPaymentDialog {...props}/>;
    return <PaymentHistoryDialog payment={action.payment} onClose={onClose}/>;
};
