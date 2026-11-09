import {useEffect, useMemo, useState, useCallback} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {Box, IconButton, Tooltip, useMediaQuery, useTheme} from "@mui/material";
import {
    AccountBalanceWalletOutlined, CancelOutlined, DocumentScanner, Edit, PaymentsOutlined, RequestQuoteOutlined
} from "@mui/icons-material";
import {useSale} from "../sale/useSale.js";
import {formatDate} from "../../utils/formatters.js";
import {formatMoney, toCents} from "../../utils/money.js";
import {useAuth} from "../../auth/hooks/useAuth.js";
import {OrderStatusChip} from "../../components/customerAccount/OrderStatusChip.jsx";

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

// En pantallas chicas (el repartidor en el celular) solo quedan cliente, estado/saldo, total y acciones.
const COMPACT_HIDDEN_COLUMNS = {
    id: false,
    saleId: false,
    requestDate: false,
    deliveryAddress: false,
    contactPhone: false,
};

// El estado de un pedido ya no se cambia a mano salvo para cancelarlo: ACTIVO y PENDIENTE los mueven el cobro
// del pedido y los abonos.
export const useDeliveryOrderTable = (deliveryOrders, {
    onlyWithBalance,
    onRegisterCollection,
    onViewPayments,
    onOpenAccount,
    onCancelOrder,
}) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);
    const {handleSaleEdit, handlePrintTicket} = useSale();
    const {isAdmin} = useAuth();
    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down('sm'));
    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

    const filteredDeliveryOrders = useMemo(() => {
        const visible = (deliveryOrders || []).filter(order => !onlyWithBalance || order.status === 'PENDIENTE');
        if (!debouncedSearchText) return visible;

        const searchLower = debouncedSearchText.toLowerCase();
        return visible.filter((order) => {
            return (
                order.id?.toString().includes(searchLower) ||
                order.saleId?.toString().includes(searchLower) ||
                order.customerName?.toLowerCase().includes(searchLower) ||
                order.deliveryAddress?.toLowerCase().includes(searchLower) ||
                order.contactPhone?.includes(searchLower) ||
                order.status?.toLowerCase().includes(searchLower)
            );
        });
    }, [deliveryOrders, debouncedSearchText, onlyWithBalance]);

    const handleSearchChange = useCallback((value) => {
        setSearchText(value);
    }, []);

    // En pantallas chicas manda el modelo compacto; lo que el usuario oculte desde el menú de columnas solo se
    // guarda en pantallas grandes.
    const handleColumnVisibilityModelChange = useCallback((model) => {
        if (!isCompact) setColumnVisibilityModel(model);
    }, [isCompact]);

    const columns = useMemo(() => {
        const dataColumns = [
            {
                field: "id",
                headerName: "ID",
                width: 80,
            },
            {
                field: "saleId",
                headerName: "Nota",
                width: 90,
                sortable: true,
            },
            {
                field: "requestDate",
                headerName: "Fecha de Solicitud",
                width: 160,
                sortable: true,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "customerName",
                headerName: "Cliente",
                width: 180,
            },
            {
                field: "deliveryAddress",
                headerName: "Dirección",
                width: 230,
                sortable: true,
            },
            {
                field: "contactPhone",
                headerName: "Teléfono",
                width: 130,
                sortable: true,
            },
            {
                field: "status",
                headerName: "Estado",
                width: 190,
                sortable: true,
                renderCell: (params) => (
                    <OrderStatusChip status={params.value} balance={toCents(params.row.balance)}/>
                ),
            },
            {
                field: "total",
                headerName: "Total",
                width: 120,
                sortable: true,
                renderCell: (params) => formatMoney(toCents(params.value)),
            },
        ];

        const actionsColumn = {
            field: "actions",
            headerName: "Acciones",
            width: 260,
            sortable: false,
            renderCell: (params) => {
                const order = params.row;
                const isCancelled = order.status === 'CANCELADO';
                return (
                    <Box sx={userTableStyles.actionsContainer}>
                        {order.status === 'ACTIVO' && !order.hasPayments && (
                            <Tooltip title="Registrar cobro">
                                <IconButton color="success" size="small" aria-label="Registrar cobro"
                                            onClick={() => onRegisterCollection(order)}>
                                    <PaymentsOutlined/>
                                </IconButton>
                            </Tooltip>
                        )}
                        {order.hasPayments && (
                            <Tooltip title="Ver abonos">
                                <IconButton color="primary" size="small" aria-label="Ver abonos"
                                            onClick={() => onViewPayments(order)}>
                                    <RequestQuoteOutlined/>
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Estado de cuenta del cliente">
                            <IconButton size="small" aria-label="Estado de cuenta del cliente"
                                        onClick={() => onOpenAccount(order)}>
                                <AccountBalanceWalletOutlined/>
                            </IconButton>
                        </Tooltip>
                        {isAdmin && !order.hasPayments && !isCancelled && (
                            <Tooltip title="Editar">
                                <IconButton color="primary" size="small" aria-label="Editar"
                                            onClick={() => handleSaleEdit(order.saleId)}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                        )}
                        {isAdmin && !order.hasPayments && !isCancelled && (
                            <Tooltip title="Cancelar pedido">
                                <IconButton color="error" size="small" aria-label="Cancelar pedido"
                                            onClick={() => onCancelOrder(order)}>
                                    <CancelOutlined/>
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title={"Ticket"}>
                            <IconButton
                                size="small"
                                color="info"
                                onClick={() => handlePrintTicket(order.saleId)}>
                                <DocumentScanner/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        };

        // En pantallas chicas las acciones van primero para no tener que desplazar la tabla.
        return isCompact ? [actionsColumn, ...dataColumns] : [...dataColumns, actionsColumn];
    }, [handleSaleEdit, handlePrintTicket, isAdmin, isCompact, onRegisterCollection, onViewPayments, onOpenAccount, onCancelOrder]);

    return {
        columns,
        rows: filteredDeliveryOrders,
        searchText,
        handleSearchChange,
        columnVisibilityModel: isCompact ? COMPACT_HIDDEN_COLUMNS : columnVisibilityModel,
        handleColumnVisibilityModelChange,
    };
};
