import {useDeliveryOrder} from "../../hooks/deliveryOrder/useDeliveryOrder.js";
import {useEffect} from "react";
import {useDeliveryOrderTable} from "../../hooks/deliveryOrder/useDeliveryOrderTable.jsx";
import {Box, Paper, TextField} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const DeliveryTable = () => {
    const {deliveryOrders, handleGetDeliveryOrders} = useDeliveryOrder();
    const {searchText, handleSearchChange, rows, columns} = useDeliveryOrderTable(deliveryOrders);

    useEffect(() => {
        handleGetDeliveryOrders();
    }, []);

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar órdenes de entrega..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!deliveryOrders}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};
