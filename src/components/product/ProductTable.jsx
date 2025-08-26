import {useProduct} from "../../hooks/product/useProduct.js";
import {useEffect} from "react";
import {useProductTable} from "../../hooks/product/useProductTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const ProductTable = () => {
    const {products, handleGetProducts} = useProduct();
    const {searchText, setSearchText, filteredProducts, columns} = useProductTable(products);

    useEffect(() => {
        handleGetProducts();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar productos..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredProducts}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!products}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};