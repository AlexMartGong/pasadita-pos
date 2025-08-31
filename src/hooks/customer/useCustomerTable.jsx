import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useCustomer} from "./useCustomer.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Edit, ToggleOn, ToggleOff} from "@mui/icons-material";

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
                <span>{params.row.customDiscount ? `${params.row.customDiscount}` : 'N/A'}</span>
            ),
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
            width: 220,
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
                </Box>
            ),
        },
    ], [handleCustomerEdit, handleCustomerToggleStatus]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredCustomers,
        columns,
    };
};
