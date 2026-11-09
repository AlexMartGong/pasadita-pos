import {useCallback, useEffect, useMemo, useState} from "react";
import {Chip, IconButton, Tooltip, Typography} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";
import {formatMoney} from "../../utils/money.js";
import {customerAccountStyles} from "../../styles/js/CustomerAccountStyles.js";

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

export const useCustomerDebtsTable = (debts, {onOpenAccount}) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);

    const rows = useMemo(() => {
        if (!debouncedSearchText) return debts;
        const searchLower = debouncedSearchText.toLowerCase();
        return debts.filter((debt) => (
            debt.name?.toLowerCase().includes(searchLower) ||
            debt.phone?.includes(searchLower)
        ));
    }, [debts, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "name",
            headerName: "Cliente",
            flex: 1,
            minWidth: 180,
        },
        {
            field: "phone",
            headerName: "Teléfono",
            width: 130,
        },
        {
            field: "totalDebt",
            headerName: "Deuda",
            width: 140,
            type: "number",
            renderCell: (params) => (
                <Typography component="span" sx={customerAccountStyles.balanceValue}>
                    {formatMoney(params.value)}
                </Typography>
            ),
        },
        {
            field: "creditLimit",
            headerName: "Límite",
            width: 140,
            type: "number",
            renderCell: (params) => (params.value > 0 ? formatMoney(params.value) : "Sin crédito"),
        },
        {
            field: "pendingNotes",
            headerName: "Notas",
            width: 90,
            type: "number",
        },
        {
            field: "overLimit",
            headerName: "Estado",
            width: 160,
            renderCell: (params) => params.value && (
                <Chip label="Rebasó su límite" color="error" size="small" sx={{fontWeight: 600}}/>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 70,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Ver estado de cuenta">
                    <IconButton
                        aria-label={`Ver estado de cuenta de ${params.row.name}`}
                        onClick={(event) => {
                            event.stopPropagation();
                            onOpenAccount(params.row.customerId);
                        }}
                    >
                        <ChevronRight/>
                    </IconButton>
                </Tooltip>
            ),
        },
    ], [onOpenAccount]);

    return {
        columns,
        rows,
        searchText,
        handleSearchChange,
    };
};
