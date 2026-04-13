import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {DocumentScanner, Edit, Payment, CheckCircle} from "@mui/icons-material";
import {useSale} from "../sale/useSale.js";
import {useDeliveryOrder} from "./useDeliveryOrder.js";
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

export const useDeliveryOrderTable = (deliveryOrders) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit, handlePrintTicket} = useSale();
    const {handleChangeDeliveryOrderStatus} = useDeliveryOrder();
    const {isAdmin} = useAuth();

    const filteredDeliveryOrders = useMemo(() => {
        const nonCancelled = (deliveryOrders || []).filter(order => order.status !== 'CANCELADO');
        if (!debouncedSearchText) return nonCancelled;

        const searchLower = debouncedSearchText.toLowerCase();
        return nonCancelled.filter((order) => {
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
            field: "status",
            headerName: "Estado",
            width: 140,
            sortable: true,
            renderCell: (params) => {
                const getStatusColor = (status) => {
                    if (status === "ACTIVO") return "success";
                    if (status === "PENDIENTE") return "warning";
                    if (status === "CANCELADO") return "error";
                    return "default";
                };
                return (
                    <Chip
                        label={params.value}
                        color={getStatusColor(params.value)}
                        variant="outlined"
                        size="small"
                    />
                );
            },
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
                            {params.row.status !== 'CANCELADO' && (
                                <Tooltip title={params.row.status === 'ACTIVO' ? "Marcar como Pendiente" : "Marcar como Activo"}>
                                    <IconButton
                                        size="small"
                                        color={params.row.status === 'ACTIVO' ? "warning" : "success"}
                                        onClick={() => {
                                            const nextStatus = params.row.status === 'ACTIVO' ? 'PENDIENTE' : 'ACTIVO';
                                            handleChangeDeliveryOrderStatus(params.row.id, {status: nextStatus});
                                        }}
                                    >
                                        {params.row.status === 'ACTIVO' ? <Payment/> : <CheckCircle/>}
                                    </IconButton>
                                </Tooltip>
                            )}
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
    ], [handleSaleEdit, handleChangeDeliveryOrderStatus, handlePrintTicket, isAdmin]);

    return {
        columns,
        rows: filteredDeliveryOrders,
        searchText,
        handleSearchChange,
    };
};
