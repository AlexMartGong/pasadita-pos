import {useSale} from "../../hooks/sale/useSale.js";
import {useEffect} from "react";
import {useSaleTable} from "../../hooks/sale/useSaleTable.jsx";
import {Box, FormControlLabel, Paper, Switch, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const SaleTable = () => {
    const {sales, handleGetSales} = useSale();
    const {searchText, setSearchText, filteredSales, columns, showAllSales, handleToggleShowAll} = useSaleTable(sales);

    useEffect(() => {
        handleGetSales();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar ventas..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={showAllSales}
                            onChange={handleToggleShowAll}
                            color="primary"
                        />
                    }
                    label={showAllSales ? "Todas las ventas" : "Ventas de hoy"}
                    sx={{ml: 2, whiteSpace: 'nowrap'}}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredSales}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!sales}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};
