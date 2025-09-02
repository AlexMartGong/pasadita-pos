import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useCustomerType} from "./useCustomerType.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Edit} from "@mui/icons-material";

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

export const useCustomerTypeTable = (customerTypes) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleCustomerTypeEdit} = useCustomerType();

    const filteredCustomerTypes = useMemo(() => {
        if (!customerTypes || !debouncedSearchText) return customerTypes || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return customerTypes.filter((customerType) => {
            return (
                customerType.name?.toLowerCase().includes(searchLower) ||
                customerType.description?.toLowerCase().includes(searchLower) ||
                customerType.discount?.toString().includes(searchLower)
            );
        });
    }, [customerTypes, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 70,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: "name",
            headerName: "Nombre",
            flex: 1,
            minWidth: 200,
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={userTableStyles}>
                    {params.value}
                </Box>
            ),
        },
        {
            field: "description",
            headerName: "Descripción",
            flex: 2,
            minWidth: 300,
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={userTableStyles}>
                    {params.value || "Sin descripción"}
                </Box>
            ),
        },
        {
            field: "discount",
            headerName: "Descuento",
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip
                    label={`$ ${params.value}`}
                    color={params.value > 0 ? "success" : "default"}
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Editar tipo de cliente">
                        <IconButton
                            onClick={() => handleCustomerTypeEdit(params.row)}
                            sx={userTableStyles.editButton}
                        >
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleCustomerTypeEdit]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredCustomerTypes,
        columns,
    };
};
