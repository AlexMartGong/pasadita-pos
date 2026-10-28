import {useDeliveryOrder} from "../../hooks/deliveryOrder/useDeliveryOrder.js";
import {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useDeliveryOrderTable} from "../../hooks/deliveryOrder/useDeliveryOrderTable.jsx";
import {useSaleCustomer} from "../../hooks/customerAccount/useSaleCustomer.js";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Paper,
    Switch, TextField
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {CollectionDialog} from "../customerAccount/CollectionDialog.jsx";
import {SalePaymentsDialog} from "../customerAccount/SalePaymentsDialog.jsx";
import {toCents} from "../../utils/money.js";

const BALANCE_FILTER = 'saldo';

export const DeliveryTable = () => {
    const {deliveryOrders, handleGetDeliveryOrders, handleChangeDeliveryOrderStatus} = useDeliveryOrder();
    const {openCustomerAccountForSale} = useSaleCustomer();
    const [searchParams, setSearchParams] = useSearchParams();
    const onlyWithBalance = searchParams.get('filtro') === BALANCE_FILTER;
    const [collectionOrder, setCollectionOrder] = useState(null);
    const [paymentsOrder, setPaymentsOrder] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const handleOpenAccount = useCallback((order) => openCustomerAccountForSale(order.saleId), [openCustomerAccountForSale]);

    const {
        searchText, handleSearchChange, rows, columns, columnVisibilityModel, handleColumnVisibilityModelChange,
    } = useDeliveryOrderTable(deliveryOrders, {
        onlyWithBalance,
        onRegisterCollection: setCollectionOrder,
        onViewPayments: setPaymentsOrder,
        onOpenAccount: handleOpenAccount,
        onCancelOrder: setCancelTarget,
    });

    useEffect(() => {
        handleGetDeliveryOrders();
    }, []);

    const handleToggleBalanceFilter = (event) => {
        setSearchParams(event.target.checked ? {filtro: BALANCE_FILTER} : {}, {replace: true});
    };

    // "Cancelar pedido" = pedido devuelto. Solo ADMIN y sin abonos (el backend también lo exige).
    const handleConfirmCancel = async () => {
        setIsCancelling(true);
        const ok = await handleChangeDeliveryOrderStatus(cancelTarget.id, {status: 'CANCELADO'});
        setIsCancelling(false);
        if (ok) {
            setCancelTarget(null);
            handleGetDeliveryOrders();
        }
    };

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={{...userTableStyles.searchContainer, flexWrap: 'wrap', alignItems: 'center'}}>
                <TextField
                    label="Buscar órdenes de entrega..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    sx={{flex: '1 1 280px'}}
                />
                <FormControlLabel
                    control={<Switch checked={onlyWithBalance} onChange={handleToggleBalanceFilter} color="warning"/>}
                    label="Solo con saldo"
                    sx={{flexShrink: 0, mr: 0}}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
                    disableRowSelectionOnClick
                    loading={!deliveryOrders}
                    sx={userTableStyles.dataGrid}
                />
            </Box>

            {collectionOrder && (
                <CollectionDialog
                    order={collectionOrder}
                    onClose={() => setCollectionOrder(null)}
                    onCompleted={handleGetDeliveryOrders}
                />
            )}

            {paymentsOrder && (
                <SalePaymentsDialog
                    saleId={paymentsOrder.saleId}
                    orderId={paymentsOrder.id}
                    noteTotal={toCents(paymentsOrder.total)}
                    onClose={() => setPaymentsOrder(null)}
                    onChanged={handleGetDeliveryOrders}
                />
            )}

            <Dialog open={Boolean(cancelTarget)} onClose={isCancelling ? undefined : () => setCancelTarget(null)}>
                <DialogTitle>Cancelar pedido #{cancelTarget?.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Úsalo cuando el pedido se devuelve. La nota #{cancelTarget?.saleId} queda cancelada y no se
                        puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelTarget(null)} disabled={isCancelling}>Volver</Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained" disabled={isCancelling}>
                        {isCancelling ? 'Cancelando...' : 'Cancelar pedido'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};
