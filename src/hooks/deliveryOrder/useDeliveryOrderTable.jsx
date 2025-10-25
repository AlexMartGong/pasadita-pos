import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useDeliveryOrder} from "./useDeliveryOrder.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Visibility, LocalShipping, Cancel, CheckCircle} from "@mui/icons-material";

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
    const {handleDeliveryOrderView, handleChangeDeliveryOrderStatus, handleGetDeliveryOrders} = useDeliveryOrder();

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

    const handleStatusToggle = useCallback(async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVO' ? 'CANCELADO' : 'ACTIVO';
        const result = await handleChangeDeliveryOrderStatus(id, {status: newStatus});
        if (result) {
            await handleGetDeliveryOrders();
        }
    }, [handleChangeDeliveryOrderStatus, handleGetDeliveryOrders]);

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

    const getStatusColor = (status) => {
        const statusColors = {
            'ACTIVO': 'success',
            'CANCELADO': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'ACTIVO': 'Activo',
            'CANCELADO': 'Cancelado'
        };
        return statusLabels[status] || status;
    };

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 80,
        },
        {
            field: "saleId",
            headerName: "Venta #",
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
            field: "deliveryCost",
            headerName: "Costo de Entrega",
            width: 140,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={formatCurrency(params.value)}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "status",
            headerName: "Estado",
            width: 140,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={getStatusLabel(params.value)}
                    color={getStatusColor(params.value)}
                    size="small"
                    icon={<LocalShipping/>}
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
                    <Tooltip title="Ver detalles">
                        <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleDeliveryOrderView(params.row.id)}
                        >
                            <Visibility/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.status === 'ACTIVO' ? "Cancelar pedido" : "Activar pedido"}>
                        <IconButton
                            size="small"
                            color={params.row.status === 'ACTIVO' ? "error" : "success"}
                            onClick={() => handleStatusToggle(params.row.id, params.row.status)}
                        >
                            {params.row.status === 'ACTIVO' ? <Cancel/> : <CheckCircle/>}
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleDeliveryOrderView, handleStatusToggle]);

    return {
        columns,
        rows: filteredDeliveryOrders,
        searchText,
        handleSearchChange,
    };
};
