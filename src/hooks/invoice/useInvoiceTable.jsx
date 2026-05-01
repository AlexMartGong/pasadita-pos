import {useEffect, useMemo, useState, useCallback} from "react";
import {useSelector} from "react-redux";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {PictureAsPdf, Code, Email, Cancel} from "@mui/icons-material";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useInvoice} from "./useInvoice.js";
import {formatDate} from "../../utils/formatters.js";

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

const STATUS_CHIP = {
    TIMBRADA: {label: 'Timbrada', color: 'success'},
    CANCELADA: {label: 'Cancelada', color: 'error'},
    PENDIENTE: {label: 'Pendiente', color: 'warning'},
    ERROR: {label: 'Error', color: 'default'},
};

export const useInvoiceTable = (invoiceList, {onRequestCancel} = {}) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleDownloadFile} = useInvoice();
    const {isAdmin} = useSelector((state) => state.auth);

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] = useState(null);

    const handleOpenEmailModal = useCallback((row) => {
        setSelectedInvoiceForEmail(row);
        setIsEmailModalOpen(true);
    }, []);

    const handleCloseEmailModal = useCallback(() => {
        setIsEmailModalOpen(false);
        setSelectedInvoiceForEmail(null);
    }, []);

    const filteredInvoiceList = useMemo(() => {
        if (!invoiceList || !debouncedSearchText) return invoiceList || [];

        const q = debouncedSearchText.toLowerCase();
        return invoiceList.filter((item) => {
            return (
                item.uuid?.toLowerCase().includes(q) ||
                item.razonSocial?.toLowerCase().includes(q) ||
                item.rfc?.toLowerCase().includes(q) ||
                String(item.saleId ?? '').includes(q) ||
                String(item.invoiceId ?? '').includes(q)
            );
        });
    }, [invoiceList, debouncedSearchText]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    const columns = useMemo(() => [
        {
            field: "invoiceId",
            headerName: "ID",
            width: 70,
        },
        {
            field: "saleId",
            headerName: "Venta #",
            width: 90,
            sortable: true,
        },
        {
            field: "razonSocial",
            headerName: "Cliente",
            width: 240,
            sortable: true,
        },
        {
            field: "uuid",
            headerName: "Folio Fiscal (UUID)",
            width: 290,
            sortable: false,
            renderCell: (params) => params.row.uuid || '—',
        },
        {
            field: "status",
            headerName: "Estado",
            width: 130,
            renderCell: (params) => {
                const cfg = STATUS_CHIP[params.row.status]
                    ?? {label: params.row.status ?? '—', color: 'default'};
                return (
                    <Chip
                        label={cfg.label}
                        color={cfg.color}
                        variant="outlined"
                        size="small"
                    />
                );
            },
        },
        {
            field: "timbradoAt",
            headerName: "Timbrado",
            width: 180,
            renderCell: (params) => params.row.timbradoAt ? formatDate(params.row.timbradoAt) : '—',
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const enabled = params.row.status === 'TIMBRADA';
                return (
                    <Box sx={userTableStyles.actionsContainer}>
                        <Tooltip title="Descargar PDF">
                            <span>
                                <IconButton
                                    size="small"
                                    color="error"
                                    disabled={!enabled}
                                    onClick={() => handleDownloadFile(params.row.saleId, 'pdf')}>
                                    <PictureAsPdf fontSize="small"/>
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Descargar XML">
                            <span>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    disabled={!enabled}
                                    onClick={() => handleDownloadFile(params.row.saleId, 'xml')}>
                                    <Code fontSize="small"/>
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Enviar por correo">
                            <span>
                                <IconButton
                                    size="small"
                                    color="info"
                                    disabled={!enabled}
                                    onClick={() => handleOpenEmailModal(params.row)}>
                                    <Email fontSize="small"/>
                                </IconButton>
                            </span>
                        </Tooltip>
                        {isAdmin && (
                            <Tooltip title="Cancelar factura">
                                <span>
                                    <IconButton
                                        size="small"
                                        color="warning"
                                        disabled={!enabled}
                                        onClick={() => onRequestCancel?.(params.row)}>
                                        <Cancel fontSize="small"/>
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },
    ], [handleDownloadFile, onRequestCancel, handleOpenEmailModal, isAdmin]);

    return {
        searchText,
        setSearchText: handleSearchChange,
        filteredInvoiceList,
        columns,
        isEmailModalOpen,
        selectedInvoiceForEmail,
        handleCloseEmailModal,
    };
};
