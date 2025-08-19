import {useEffect, useMemo, useState, useCallback} from "react";
import {Chip} from "@mui/material";

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
            width: 130,
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
        }
    ], []);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredProducts,
        columns,
    };
};