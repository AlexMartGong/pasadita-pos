import {useEffect, useMemo, useState, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useCustomer} from "./useCustomer.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {AccountBalanceWalletOutlined, Edit, ToggleOn, ToggleOff} from "@mui/icons-material";
import {formatMoney, toCents} from "../../utils/money.js";

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

export const useCustomerTable = (customers) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleCustomerEdit, handleCustomerToggleStatus} = useCustomer();
    const navigate = useNavigate();

    const filteredCustomers = useMemo(() => {
        if (!customers || !debouncedSearchText) return customers || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return customers.filter((customer) => {
            return (
                customer.name?.toLowerCase().includes(searchLower) ||
                customer.phone?.toLowerCase().includes(searchLower) ||
                customer.address?.toLowerCase().includes(searchLower) ||
                customer.city?.toLowerCase().includes(searchLower) ||
                customer.customerTypeName?.toLowerCase().includes(searchLower)
            );
        });
    }, [customers, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 70,
        },
        {
            field: "name",
            headerName: "Nombre",
            width: 180,
            sortable: true,
        },
        {
            field: "phone",
            headerName: "Teléfono",
            width: 130,
        },
        {
            field: "address",
            headerName: "Dirección",
            width: 200,
            sortable: true,
        },
        {
            field: "city",
            headerName: "Ciudad",
            width: 120,
            sortable: true,
        },
        {
            field: "customerTypeName",
            headerName: "Tipo Cliente",
            width: 140,
            sortable: true,
        },
        {
            field: "customDiscount",
            headerName: "Descuento",
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={`$ ${params.value}`}
                    color="info"
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "creditLimit",
            headerName: "Límite",
            width: 120,
            renderCell: (params) => {
                if (params.row.walkIn) return "—";
                const limit = toCents(params.value);
                return limit > 0 ? formatMoney(limit) : "Sin crédito";
            },
        },
        {
            field: "active",
            headerName: "Activo",
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.row.active ? "Si" : "No"}
                    color={params.row.active ? "success" : "default"}
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 270,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleCustomerEdit(params.row.id)}>
                            <Edit/> Editar
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Desactivar" : "Activar"}>
                        <IconButton
                            size="small"
                            color={params.row.active ? "success" : "default"}
                            onClick={() => handleCustomerToggleStatus(params.row.id, params.row.active)}>
                            {params.row.active ? <ToggleOn/> : <ToggleOff/>} Estado
                        </IconButton>
                    </Tooltip>
                    {!params.row.walkIn && (
                        <Tooltip title="Estado de cuenta">
                            <IconButton
                                size="small"
                                aria-label="Estado de cuenta"
                                onClick={() => navigate(`/customers/${params.row.id}/account`)}>
                                <AccountBalanceWalletOutlined/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ], [handleCustomerEdit, handleCustomerToggleStatus, navigate]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredCustomers,
        columns,
    };
};
