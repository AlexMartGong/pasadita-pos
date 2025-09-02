import {useCustomer} from "../../hooks/customer/useCustomer.js";
import {useEffect} from "react";
import {useCustomerTable} from "../../hooks/customer/useCustomerTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const CustomerTable = () => {
    const {customers, handleGetCustomers} = useCustomer();
    const {searchText, setSearchText, filteredCustomers, columns} = useCustomerTable(customers);

    useEffect(() => {
        handleGetCustomers();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar clientes..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredCustomers}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!customers}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};
