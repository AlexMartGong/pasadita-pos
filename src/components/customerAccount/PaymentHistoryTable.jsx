import {Box, Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {usePaymentHistoryTable} from "../../hooks/customerAccount/usePaymentHistoryTable.jsx";

// Historial paginado en el servidor: `rowCount` viene de `totalElements` del Page de Spring.
export const PaymentHistoryTable = ({rows, totalElements, loading, paginationModel, onPaginationModelChange, onRowClick}) => {
    const {columns} = usePaymentHistoryTable();

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.historyId}
                    paginationMode="server"
                    rowCount={totalElements}
                    paginationModel={paginationModel}
                    onPaginationModelChange={onPaginationModelChange}
                    pageSizeOptions={[10, 20, 50]}
                    onRowClick={(params) => onRowClick(params.row)}
                    disableColumnFilter
                    disableRowSelectionOnClick
                    loading={loading}
                    localeText={{noRowsLabel: 'Sin movimientos con estos filtros'}}
                    sx={{...userTableStyles.dataGrid, '& .MuiDataGrid-row': {cursor: 'pointer'}}}
                />
            </Box>
        </Paper>
    );
};
