import {useMemo} from "react";
import {Typography} from "@mui/material";
import {PaymentActionChip} from "../../components/customerAccount/PaymentActionChip.jsx";
import {formatDate} from "../../utils/formatters.js";
import {describeHistoryAmount, describeHistoryMethod} from "../../utils/paymentHistoryActions.js";
import {customerAccountStyles} from "../../styles/js/CustomerAccountStyles.js";

// Columnas del historial global. El orden lo fija el backend (más reciente primero): ninguna se ordena.
export const usePaymentHistoryTable = () => {
    const columns = useMemo(() => [
        {
            field: "changedAt",
            headerName: "Fecha",
            width: 150,
            renderCell: (params) => formatDate(params.value),
        },
        {
            field: "action",
            headerName: "Acción",
            width: 130,
            renderCell: (params) => <PaymentActionChip action={params.value}/>,
        },
        {
            field: "customerName",
            headerName: "Cliente",
            width: 170,
        },
        {
            field: "note",
            headerName: "Pedido / Nota",
            width: 160,
            valueGetter: (value, row) => (row.orderId ? `Pedido #${row.orderId} · Nota #${row.saleId}` : `Nota #${row.saleId}`),
        },
        {
            field: "amount",
            headerName: "Monto",
            width: 200,
            valueGetter: (value, row) => describeHistoryAmount(row),
            renderCell: (params) => (
                <Typography component="span" variant="body2" sx={customerAccountStyles.amount}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: "method",
            headerName: "Método",
            width: 210,
            valueGetter: (value, row) => describeHistoryMethod(row),
        },
        {
            field: "reason",
            headerName: "Motivo",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "employeeName",
            headerName: "Empleado",
            width: 160,
        },
    ].map((column) => ({...column, sortable: false})), []);

    return {columns};
};
