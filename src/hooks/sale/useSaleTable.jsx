import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useSale} from "./useSale.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Edit, Visibility} from "@mui/icons-material";

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

export const useSaleTable = (sales) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit} = useSale();

    const filteredSales = useMemo(() => {
        if (!sales || !debouncedSearchText) return sales || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return sales.filter((sale) => {
            return (
                sale.id?.toString().includes(searchLower) ||
                sale.customerName?.toLowerCase().includes(searchLower) ||
                sale.employeeName?.toLowerCase().includes(searchLower) ||
                sale.total?.toString().includes(searchLower)
            );
        });
    }, [sales, debouncedSearchText]);

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
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Ver Detalles">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleSaleEdit(params.row.id)}>
                            <Visibility/> Ver
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSaleEdit(params.row.id)}>
                            <Edit/> Editar
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleSaleEdit]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredSales,
        columns,
    };
};
