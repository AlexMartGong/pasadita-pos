import {useEffect} from "react";
import {useCustomerFiscalData} from "../../hooks/customerFiscalData/useCustomerFiscalData.js";
import {useCustomerFiscalDataTable} from "../../hooks/customerFiscalData/useCustomerFiscalDataTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const CustomerFiscalDataTable = () => {
    const {customerFiscalDataList, handleGetAllFiscalData} = useCustomerFiscalData();
    const {
        searchText,
        setSearchText,
        filteredFiscalDataList,
        columns
    } = useCustomerFiscalDataTable(customerFiscalDataList);

    useEffect(() => {
        handleGetAllFiscalData();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar perfil fiscal..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredFiscalDataList}
                    columns={columns}
                    getRowId={(row) => row.fiscalId}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!customerFiscalDataList}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};
