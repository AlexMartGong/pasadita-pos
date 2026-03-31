import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useSale} from "./useSale.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {DocumentScanner, Edit, Payment} from "@mui/icons-material";
import {formatDate, formatCurrency} from "../../utils/formatters.js";
import {useAuth} from "../../auth/hooks/useAuth.js";

export const FILTER_OPTIONS = {
    TODAY_ALL: 'today_all',
    TODAY_MORNING: 'today_morning',
    TODAY_AFTERNOON: 'today_afternoon',
    ALL: 'all',
};

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

const isToday = (dateString) => {
    const saleDate = new Date(dateString);
    const today = new Date();
    return (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
    );
};

const isInShift = (dateString, startHour, endHour) => {
    const saleDate = new Date(dateString);
    const hour = saleDate.getHours();
    return hour >= startHour && hour < endHour;
};

export const useSaleTable = (sales, filterOption = FILTER_OPTIONS.TODAY_ALL) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit, handlePaymentToggle, handlePrintTicket} = useSale();
    const {isAdmin} = useAuth();

    const filteredSales = useMemo(() => {
        if (!sales) return [];

        // Solo ventas en caja (sin pedidos a domicilio)
        let result = sales.filter((sale) => sale.deliveryOrderId == null);

        // Filtrar por turno/fecha
        if (filterOption === FILTER_OPTIONS.TODAY_ALL) {
            result = result.filter((sale) => isToday(sale.datetime));
        } else if (filterOption === FILTER_OPTIONS.TODAY_MORNING) {
            result = result.filter((sale) => isToday(sale.datetime) && isInShift(sale.datetime, 6, 14));
        } else if (filterOption === FILTER_OPTIONS.TODAY_AFTERNOON) {
            result = result.filter((sale) => isToday(sale.datetime) && isInShift(sale.datetime, 14, 22));
        }
        // FILTER_OPTIONS.ALL: sin filtro de fecha

        // Aplicar filtro de búsqueda
        if (debouncedSearchText) {
            const searchLower = debouncedSearchText.toLowerCase();
            result = result.filter((sale) => {
                return (
                    sale.id?.toString().includes(searchLower) ||
                    sale.customerName?.toLowerCase().includes(searchLower) ||
                    sale.employeeName?.toLowerCase().includes(searchLower) ||
                    sale.total?.toString().includes(searchLower)
                );
            });
        }

        return result;
    }, [sales, debouncedSearchText, filterOption]);

    const filteredCount = useMemo(() => filteredSales.length, [filteredSales]);

    const filteredTotal = useMemo(() => {
        return filteredSales
            .filter((sale) => sale.paid === true)
            .reduce((sum, sale) => sum + (sale.total || 0), 0);
    }, [filteredSales]);

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
            field: "datetime",
            headerName: "Fecha",
            width: 160,
            sortable: true,
            renderCell: (params) => formatDate(params.value),
        },
        {
            field: "customerName",
            headerName: "Cliente",
            width: 180,
            sortable: true,
        },
        {
            field: "employeeName",
            headerName: "Empleado",
            width: 180,
            sortable: true,
        },
        {
            field: "paymentMethodName",
            headerName: "Método de Pago",
            width: 180,
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
            width: 250,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    {isAdmin && (<>
                            <Tooltip title="Editar">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleSaleEdit(params.row.id)}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={params.row.paid ? "Marcar como Pendiente" : "Marcar como Pagado"}>
                                <IconButton
                                    size="small"
                                    color={params.row.paid ? "warning" : "success"}
                                    onClick={() => handlePaymentToggle(params.row.id, params.row.paid)}>
                                    <Payment/>
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title={"Ticket"}>
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handlePrintTicket(params.row.id)}>
                            <DocumentScanner/>
                        </IconButton>
                    </Tooltip>
                </Box>

            ),
        },
    ], [isAdmin, handleSaleEdit, handlePaymentToggle, handlePrintTicket]);

    return {
        setSearchText: handleSearchChange,
        searchText,
        filteredSales,
        filteredCount,
        filteredTotal,
        columns,
    };
};
