import {useState, useCallback} from "react";
import {
    Box,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useInvoice} from "../../hooks/invoice/useInvoice.js";
import {useInvoiceTable} from "../../hooks/invoice/useInvoiceTable.jsx";
import {SendEmailModal} from "./SendEmailModal.jsx";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const InvoiceTable = () => {
    const {
        invoiceList,
        loading,
        handleCancelInvoice,
    } = useInvoice();

    const [cancelTarget, setCancelTarget] = useState(null);

    const onRequestCancel = useCallback((row) => {
        setCancelTarget(row);
    }, []);

    const {
        searchText,
        setSearchText,
        filteredInvoiceList,
        columns,
        isEmailModalOpen,
        selectedInvoiceForEmail,
        handleCloseEmailModal,
    } = useInvoiceTable(invoiceList, {onRequestCancel});

    const closeCancel = () => setCancelTarget(null);

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        const ok = await handleCancelInvoice(cancelTarget.invoiceId);
        if (ok) closeCancel();
    };

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar por UUID, RFC, cliente, venta..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredInvoiceList}
                    columns={columns}
                    getRowId={(row) => row.invoiceId}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={loading}
                    sx={userTableStyles.dataGrid}
                />
            </Box>

            <Dialog open={!!cancelTarget} onClose={closeCancel}>
                <DialogTitle>Cancelar factura</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Confirma cancelar la factura{' '}
                        {cancelTarget?.uuid ? `con UUID ${cancelTarget.uuid}` : `#${cancelTarget?.invoiceId}`}?
                        Esta acción enviará el motivo SAT "02" a Facturapi y no puede revertirse.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCancel} color="primary">
                        Cerrar
                    </Button>
                    <Button onClick={confirmCancel} color="error" autoFocus>
                        Cancelar factura
                    </Button>
                </DialogActions>
            </Dialog>

            <SendEmailModal
                open={isEmailModalOpen}
                onClose={handleCloseEmailModal}
                invoice={selectedInvoiceForEmail}
            />
        </Paper>
    );
};
