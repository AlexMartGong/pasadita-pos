import {useEffect, useState} from "react";
import {Box, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {HistoryOutlined} from "@mui/icons-material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {PaymentHistoryFilters} from "../../components/customerAccount/PaymentHistoryFilters.jsx";
import {PaymentHistoryTable} from "../../components/customerAccount/PaymentHistoryTable.jsx";
import {SalePaymentsDialog} from "../../components/customerAccount/SalePaymentsDialog.jsx";
import {usePaymentHistorySearch} from "../../hooks/customerAccount/usePaymentHistorySearch.js";
import {useCustomerLookup} from "../../hooks/customerAccount/useCustomerLookup.js";
import {useUser} from "../../hooks/user/useUser.js";
import {currentMonthRange} from "../../utils/formatters.js";

const initialFilters = () => ({...currentMonthRange(), employeeId: '', customerId: '', action: ''});

// 5.10 Historial de abonos (ADMIN): todos los cambios, del más reciente al más viejo.
export const PaymentHistoryPage = () => {
    const {users, getAllUsers} = useUser();
    const {customers} = useCustomerLookup();
    const [filters, setFilters] = useState(initialFilters);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 20});
    const [selectedNote, setSelectedNote] = useState(null);

    const rangeError = filters.from && filters.to && filters.from > filters.to
        ? 'La fecha inicial no puede ser posterior a la final.'
        : null;
    const {rows, totalElements, loading, reload} = usePaymentHistorySearch(filters, paginationModel, {
        enabled: !rangeError,
    });

    useEffect(() => {
        getAllUsers();
    }, []);

    // Cambiar un filtro vuelve a la primera página.
    const handleFiltersChange = (changes) => {
        setFilters((previous) => ({...previous, ...changes}));
        setPaginationModel((previous) => ({...previous, page: 0}));
    };

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <HistoryOutlined sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Historial de abonos
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Cada abono creado, modificado o cancelado, con su motivo y quién lo hizo
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Movimientos
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary', ...pageContainerStyles.contentSubtitle}}>
                        Toca un movimiento para ver los abonos de esa nota
                    </Typography>
                </Box>
                <CardContent sx={{p: 2}}>
                    <PaymentHistoryFilters
                        filters={filters}
                        onChange={handleFiltersChange}
                        employees={users}
                        customers={customers}
                        rangeError={rangeError}
                    />
                    <PaymentHistoryTable
                        rows={rows}
                        totalElements={totalElements}
                        loading={loading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        onRowClick={(row) => setSelectedNote({saleId: row.saleId, orderId: row.orderId})}
                    />
                </CardContent>
            </Card>

            {selectedNote && (
                <SalePaymentsDialog
                    saleId={selectedNote.saleId}
                    orderId={selectedNote.orderId}
                    onClose={() => setSelectedNote(null)}
                    onChanged={reload}
                />
            )}
        </Container>
    );
};
