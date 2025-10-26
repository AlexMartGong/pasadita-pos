import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useDeliveryOrder} from "./useDeliveryOrder.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Visibility, LocalShipping, Cancel, CheckCircle, Edit, Payment} from "@mui/icons-material";
import {useSale} from "../sale/useSale.js";
import {useSaleTable} from "../sale/useSaleTable.jsx";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useDeliveryOrderTable = (deliveryOrders) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit, handlePaymentToggle} = useSale();

    const filteredDeliveryOrders = useMemo(() => {
        if (!deliveryOrders || !debouncedSearchText) return deliveryOrders || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return deliveryOrders.filter((order) => {
            return (
                order.id?.toString().includes(searchLower) ||
                order.saleId?.toString().includes(searchLower) ||
                order.deliveryAddress?.toLowerCase().includes(searchLower) ||
                order.contactPhone?.includes(searchLower) ||
                order.status?.toLowerCase().includes(searchLower)
            );
        });
    }, [deliveryOrders, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 80,
        },
        {
            field: "saleId",
            headerName: "Venta",
            width: 100,
            sortable: true,
        },
        {
            field: "requestDate",
            headerName: "Fecha de Solicitud",
            width: 160,
            sortable: true,
            renderCell: (params) => formatDate(params.value),
        },
        {
            field: "customerName",
            headerName: "Cliente",
            width: 180,
        },
        {
            field: "deliveryAddress",
            headerName: "Dirección",
            width: 250,
            sortable: true,
        },
        {
            field: "contactPhone",
            headerName: "Teléfono",
            width: 130,
            sortable: true,
        },
        {
            field: "paid",
            headerName: "Pagado",
            width: 180,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Pagado" : "Pendiente"}
                    color={params.value ? "success" : "warning"}
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "total",
            headerName: "Total",
            width: 140,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={formatCurrency(params.value)}
                    color="success"
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Editar">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleSaleEdit(params.row.saleId)}
                        >
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.paid ? "Marcar como Pendiente" : "Marcar como Pagado"}>
                        <IconButton
                            size="small"
                            color={params.row.paid ? "warning" : "success"}
                            onClick={() => handlePaymentToggle(params.row.saleId, params.row.paid)}>
                            <Payment/>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleSaleEdit, handlePaymentToggle]);

    return {
        columns,
        rows: filteredDeliveryOrders,
        searchText,
        handleSearchChange,
    };
};
