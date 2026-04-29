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
import {userTableStyles} from "../../styles/js/UserTable.js";

export const InvoiceTable = () => {
    const {
        invoiceList,
        loading,
        handleCancelInvoice,
        handleSendInvoiceEmail,
    } = useInvoice();

    const [cancelTarget, setCancelTarget] = useState(null);
    const [emailTarget, setEmailTarget] = useState(null);
    const [emailValue, setEmailValue] = useState("");

    const onRequestCancel = useCallback((row) => {
        setCancelTarget(row);
    }, []);

    const onRequestEmail = useCallback((row) => {
        setEmailTarget(row);
        setEmailValue("");
    }, []);

    const {
        searchText,
        setSearchText,
        filteredInvoiceList,
        columns,
    } = useInvoiceTable(invoiceList, {onRequestCancel, onRequestEmail});

    const closeCancel = () => setCancelTarget(null);

    const closeEmail = () => {
        setEmailTarget(null);
        setEmailValue("");
    };

    const confirmCancel = async () => {
        if (!cancelTarget) return;
        const ok = await handleCancelInvoice(cancelTarget.invoiceId);
        if (ok) closeCancel();
    };

    const confirmEmail = async () => {
        if (!emailTarget || !emailValue) return;
        const ok = await handleSendInvoiceEmail(emailTarget.saleId, emailValue);
        if (ok) closeEmail();
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

            <Dialog open={!!emailTarget} onClose={closeEmail} fullWidth maxWidth="sm">
                <DialogTitle>Enviar factura por correo</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{mb: 2}}>
                        Factura {emailTarget?.uuid ? `UUID ${emailTarget.uuid}` : `#${emailTarget?.invoiceId}`}{' '}
                        (Venta #{emailTarget?.saleId}).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        fullWidth
                        type="email"
                        label="Correo del destinatario"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEmail}>Cerrar</Button>
                    <Button onClick={confirmEmail} variant="contained" disabled={!emailValue}>
                        Enviar
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};
