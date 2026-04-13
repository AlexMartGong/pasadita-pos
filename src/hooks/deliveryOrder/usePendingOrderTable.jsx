import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Cancel, CheckCircle, DocumentScanner, Edit, Payment} from "@mui/icons-material";
import {useSale} from "../sale/useSale.js";
import {formatDate, formatCurrency} from "../../utils/formatters.js";
import {useAuth} from "../../auth/hooks/useAuth.js";

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

export const usePendingOrderTable = (deliveryOrders, onCancelClick, onActivateClick) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit, handlePaymentToggle, handlePrintTicket} = useSale();
    const {isAdmin} = useAuth();

    const pendingOrders = useMemo(() => {
        if (!deliveryOrders) return [];
        return deliveryOrders.filter(
            (order) => order.status === 'PENDIENTE'
        );
    }, [deliveryOrders]);

    const pendingCount = useMemo(() => pendingOrders.length, [pendingOrders]);

    const totalOwed = useMemo(() => {
        return pendingOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    }, [pendingOrders]);

    const filteredOrders = useMemo(() => {
        if (!debouncedSearchText) return pendingOrders;

        const searchLower = debouncedSearchText.toLowerCase();
        return pendingOrders.filter((order) => {
            return (
                order.id?.toString().includes(searchLower) ||
                order.saleId?.toString().includes(searchLower) ||
                order.deliveryAddress?.toLowerCase().includes(searchLower) ||
                order.contactPhone?.includes(searchLower) ||
                order.customerName?.toLowerCase().includes(searchLower)
            );
        });
    }, [pendingOrders, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

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
            headerName: "Direccion",
            width: 250,
            sortable: true,
        },
        {
            field: "contactPhone",
            headerName: "Telefono",
            width: 130,
            sortable: true,
        },
        {
            field: "status",
            headerName: "Estado",
            width: 130,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'PENDIENTE' ? "Pendiente" : params.value}
                    color="warning"
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
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    {isAdmin && (
                        <>
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
                            <Tooltip title="Marcar como Activo">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => onActivateClick(params.row.id)}>
                                    <CheckCircle/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar Orden">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onCancelClick(params.row.id)}>
                                    <Cancel/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title={"Ticket"}>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handlePrintTicket(params.row.saleId)}>
                            <DocumentScanner/>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleSaleEdit, handlePaymentToggle, handlePrintTicket, isAdmin, onCancelClick, onActivateClick]);

    return {
        columns,
        rows: filteredOrders,
        searchText,
        handleSearchChange,
        pendingCount,
        totalOwed,
    };
};
