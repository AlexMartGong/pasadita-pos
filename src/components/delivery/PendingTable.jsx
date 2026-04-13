import {useDeliveryOrder} from "../../hooks/deliveryOrder/useDeliveryOrder.js";
import {useCallback, useEffect, useState} from "react";
import {usePendingOrderTable} from "../../hooks/deliveryOrder/usePendingOrderTable.jsx";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const PendingTable = ({onStatsChange}) => {
    const {deliveryOrders, handleGetDeliveryOrders, handleChangeDeliveryOrderStatus} = useDeliveryOrder();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const handleCancelClick = useCallback((orderId) => {
        setOrderToCancel(orderId);
        setConfirmOpen(true);
    }, []);

    const handleActivateClick = useCallback(async (orderId) => {
        await handleChangeDeliveryOrderStatus(orderId, {status: 'ACTIVO'});
    }, [handleChangeDeliveryOrderStatus]);

    const {searchText, handleSearchChange, rows, columns, pendingCount, totalOwed} = usePendingOrderTable(deliveryOrders, handleCancelClick, handleActivateClick);

    useEffect(() => {
        handleGetDeliveryOrders();
    }, []);

    useEffect(() => {
        onStatsChange({pendingCount, totalOwed});
    }, [pendingCount, totalOwed]);

    const handleConfirmCancel = async () => {
        if (orderToCancel) {
            await handleChangeDeliveryOrderStatus(orderToCancel, {status: 'CANCELADO'});
        }
        setConfirmOpen(false);
        setOrderToCancel(null);
    };

    const handleCloseDialog = () => {
        setConfirmOpen(false);
        setOrderToCancel(null);
    };

    return (
        <>
            <Paper sx={userTableStyles.paper}>
                <Box sx={userTableStyles.searchContainer}>
                    <TextField
                        fullWidth
                        label="Buscar pedidos pendientes..."
                        variant="outlined"
                        value={searchText}
                        onChange={(e) => handleSearchChange(e.target.value)}
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
                        disableRowSelectionOnClick
                        loading={!deliveryOrders}
                        sx={userTableStyles.dataGrid}
                    />
                </Box>
            </Paper>

            <Dialog
                open={confirmOpen}
                onClose={handleCloseDialog}
            >
                <DialogTitle>
                    Cancelar Orden
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estas seguro de que deseas cancelar esta orden de entrega? Esta accion no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Volver
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" autoFocus>
                        Confirmar Cancelacion
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
