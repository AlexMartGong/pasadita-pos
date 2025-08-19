import {useProduct} from "../../hooks/product/useProduct.js";
import {useEffect} from "react";
import {useProductTable} from "../../hooks/product/useProductTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

export const ProductTable = () => {
    const {products, handleGetProducts} = useProduct();
    const {searchText, setSearchText, filteredProducts, columns} = useProductTable(products);

    useEffect(() => {
        handleGetProducts();
    }, []);

    return (
        <Paper sx={{p: 2, height: "100%"}}>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2}}>
                <TextField
                    fullWidth
                    label="Buscar productos..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={{height: 600, width: "100%"}}>
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
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            color: "#000",
                            fontSize: 16,
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#fff",
                        },
                    }}
                />
            </Box>
        </Paper>
    );
};