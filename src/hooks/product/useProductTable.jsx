import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useProduct} from "./useProduct.js";
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

export const useProductTable = (products) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleProductEdit, handleProductToggleStatus} = useProduct();

    const filteredProducts = useMemo(() => {
        if (!products || !debouncedSearchText) return products || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return products.filter((product) => {
            return (
                product.name?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower)
            );
        });
    }, [products, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 90,
        },
        {
            field: "name",
            headerName: "Nombre",
            width: 270,
            sortable: true,
        },
        {
            field: "category",
            headerName: "Categoria",
            width: 180,
            sortable: true,
        },
        {
            field: "price",
            headerName: "Precio",
            width: 100,
        },
        {
            field: "unitMeasure",
            headerName: "Unidad de medida",
            width: 150,
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
                            onClick={() => handleProductEdit(params.row.id)}>
                            <Edit/> Editar
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Desactivar" : "Activar"}>
                        <IconButton
                            size="small"
                            color={params.row.active ? "success" : "default"}
                            onClick={() => handleProductToggleStatus(params.row.id, params.row.active)}>
                            {params.row.active ? <ToggleOn/> : <ToggleOff/>} Estado
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleProductEdit, handleProductToggleStatus]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredProducts,
        columns,
    };
};