import {useCustomerType} from "../../hooks/customer/useCustomerType.js";
import {useEffect} from "react";
import {useCustomerTypeTable} from "../../hooks/customer/useCustomerTypeTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const CustomerTypeTable = () => {
    const {customerTypes, handleGetCustomerTypes} = useCustomerType();
    const {searchText, setSearchText, filteredCustomerTypes, columns} = useCustomerTypeTable(customerTypes);

    useEffect(() => {
        handleGetCustomerTypes();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar tipos de cliente..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredCustomerTypes}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!customerTypes}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};
