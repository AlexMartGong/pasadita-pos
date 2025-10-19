import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useDeliveryOrder} from "./useDeliveryOrder.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Edit, Visibility, LocalShipping} from "@mui/icons-material";

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
    const {handleDeliveryOrderView, handleChangeDeliveryOrderStatus} = useDeliveryOrder();

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

    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': 'warning',
            'IN_PROGRESS': 'info',
            'DELIVERED': 'success',
            'CANCELLED': 'error',
            'RETURNED': 'default'
        };
        return statusColors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'PENDING': 'Pendiente',
            'IN_PROGRESS': 'En Progreso',
            'DELIVERED': 'Entregado',
            'CANCELLED': 'Cancelado',
            'RETURNED': 'Devuelto'
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
            width: 120,
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
                    <Tooltip title="Cambiar estado">
                        <IconButton
                            color="secondary"
                            size="small"
                            onClick={() => {
                                // This could open a dialog to change status
                                const newStatus = prompt('Ingrese el nuevo estado (PENDING, IN_PROGRESS, DELIVERED, CANCELLED, RETURNED):');
                                if (newStatus) {
                                    handleChangeDeliveryOrderStatus(params.row.id, {status: newStatus.toUpperCase()});
                                }
                            }}
                            disabled={params.row.status === 'DELIVERED' || params.row.status === 'CANCELLED'}
                        >
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleDeliveryOrderView, handleChangeDeliveryOrderStatus]);

    return {
        columns,
        rows: filteredDeliveryOrders,
        searchText,
        handleSearchChange,
    };
};
