import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useCustomerFiscalData} from "./useCustomerFiscalData.js";
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

export const useCustomerFiscalDataTable = (fiscalDataList) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleFiscalDataEdit} = useCustomerFiscalData();

    const filteredFiscalDataList = useMemo(() => {
        if (!fiscalDataList || !debouncedSearchText) return fiscalDataList || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return fiscalDataList.filter((item) => {
            return (
                item.rfc?.toLowerCase().includes(searchLower) ||
                item.razonSocial?.toLowerCase().includes(searchLower) ||
                item.regimenFiscal?.toLowerCase().includes(searchLower) ||
                item.usoCfdi?.toLowerCase().includes(searchLower) ||
                item.emailFacturacion?.toLowerCase().includes(searchLower)
            );
        });
    }, [fiscalDataList, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "fiscalId",
            headerName: "ID",
            width: 70,
        },
        {
            field: "rfc",
            headerName: "RFC",
            width: 160,
            sortable: true,
        },
        {
            field: "razonSocial",
            headerName: "Razón Social",
            width: 240,
            sortable: true,
        },
        {
            field: "regimenFiscal",
            headerName: "Régimen Fiscal",
            width: 140,
            sortable: true,
        },
        {
            field: "usoCfdi",
            headerName: "Uso CFDI",
            width: 110,
            sortable: true,
        },
        {
            field: "active",
            headerName: "Estado",
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.row.active ? "Activo" : "Inactivo"}
                    color={params.row.active ? "success" : "default"}
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleFiscalDataEdit(params.row.fiscalId)}>
                            <Edit/> Editar
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleFiscalDataEdit]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredFiscalDataList,
        columns,
    };
};
