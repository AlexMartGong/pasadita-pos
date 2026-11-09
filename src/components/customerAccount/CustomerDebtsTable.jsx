import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useCustomerDebtsTable} from "../../hooks/customerAccount/useCustomerDebtsTable.jsx";

export const CustomerDebtsTable = ({debts, loading, onOpenAccount}) => {
    const {searchText, handleSearchChange, rows, columns} = useCustomerDebtsTable(debts, {onOpenAccount});

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar cliente..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.customerId}
                    onRowClick={(params) => onOpenAccount(params.row.customerId)}
                    initialState={{
                        sorting: {sortModel: [{field: 'totalDebt', sort: 'desc'}]},
                        pagination: {paginationModel: {pageSize: 25}},
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={loading}
                    localeText={{noRowsLabel: 'Ningún cliente tiene saldo pendiente'}}
                    sx={{...userTableStyles.dataGrid, '& .MuiDataGrid-row': {cursor: 'pointer'}}}
                />
            </Box>
        </Paper>
    );
};
