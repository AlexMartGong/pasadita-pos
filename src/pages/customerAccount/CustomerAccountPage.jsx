import {useState} from "react";
import {useParams} from "react-router-dom";
import {
    Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Paper, Typography
} from "@mui/material";
import {
    AccountBalanceWalletOutlined, CreditScoreOutlined, ReceiptLongOutlined, SavingsOutlined, WarningAmberOutlined
} from "@mui/icons-material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {customerAccountStyles} from "../../styles/js/CustomerAccountStyles.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";
import {PendingNoteCard} from "../../components/customerAccount/PendingNoteCard.jsx";
import {PaymentDialog} from "../../components/customerAccount/PaymentDialog.jsx";
import {CreditLimitDialog} from "../../components/customerAccount/CreditLimitDialog.jsx";
import {PaymentActionDialogs} from "../../components/customerAccount/PaymentActionDialogs.jsx";
import {useCustomerAccount} from "../../hooks/customerAccount/useCustomerAccount.js";
import {useCustomerLookup} from "../../hooks/customerAccount/useCustomerLookup.js";
import {useAuth} from "../../auth/hooks/useAuth.js";
import {formatMoney} from "../../utils/money.js";

// 5.2 Estado de cuenta. Es página (no diálogo) para que el "atrás" del celular funcione y se pueda enlazar
// desde pedidos, clientes, POS y clientes con saldo.
export const CustomerAccountPage = () => {
    const {customerId: customerIdParam} = useParams();
    const customerId = Number(customerIdParam);
    const isValidId = Number.isInteger(customerId) && customerId > 0;
    const {isAdmin} = useAuth();
    const {account, loading, failed, reload} = useCustomerAccount(isValidId ? customerId : null);
    const {findCustomer} = useCustomerLookup();
    const [paymentDialog, setPaymentDialog] = useState(null);
    const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
    const [paymentAction, setPaymentAction] = useState(null);

    // `walkIn` viene de la lista de clientes: hasta que llega, no se ofrecen acciones de crédito.
    const customer = findCustomer(customerId);
    const managesCredit = Boolean(customer && !customer.walkIn);
    const hasDebt = Boolean(account && account.totalDebt > 0);

    if (!account) {
        return (
            <Container maxWidth="xl" sx={pageContainerStyles.main}>
                <Box sx={customerAccountStyles.emptyState}>
                    {!isValidId ? (
                        <Typography>No se encontró el cliente.</Typography>
                    ) : loading || !failed ? (
                        <CircularProgress/>
                    ) : (
                        <>
                            <Typography sx={{mb: 2}}>No se pudo cargar el estado de cuenta.</Typography>
                            <Button variant="contained" onClick={reload}>Reintentar</Button>
                        </>
                    )}
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <AccountBalanceWalletOutlined sx={pageHeaderStyles.icon}/>
                        <Box sx={{minWidth: 0}}>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Estado de cuenta
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                {account.name}
                            </Typography>
                            <Box sx={customerAccountStyles.headerChips}>
                                {account.overLimit && (
                                    <Chip icon={<WarningAmberOutlined/>} label="Rebasó su límite" color="error"
                                          sx={{fontWeight: 700}}/>
                                )}
                                {customer?.walkIn && (
                                    <Chip label="Público en general"
                                          sx={{backgroundColor: 'rgba(255,255,255,0.9)', fontWeight: 600}}/>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {managesCredit && (hasDebt || isAdmin) && (
                        <Box sx={customerAccountStyles.headerActions}>
                            {hasDebt && (
                                <Button variant="contained" size="large" startIcon={<SavingsOutlined/>}
                                        onClick={() => setPaymentDialog({mode: 'account'})}
                                        sx={pageHeaderStyles.actionButton}>
                                    Registrar abono
                                </Button>
                            )}
                            {isAdmin && (
                                <Button variant="contained" size="large" startIcon={<CreditScoreOutlined/>}
                                        onClick={() => setIsCreditDialogOpen(true)}
                                        sx={pageHeaderStyles.actionButton}>
                                    Editar límite
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>

            {customer?.walkIn && (
                <Alert severity="info" sx={{mb: 3}}>
                    Público en general no maneja crédito: sus pedidos se cobran completos.
                </Alert>
            )}

            <StatsCardContainer>
                <StatsCard
                    label="Límite de crédito"
                    value={account.creditLimit > 0 ? formatMoney(account.creditLimit) : 'Sin crédito'}
                    icon={CreditScoreOutlined}
                    color="info"
                />
                <StatsCard
                    label="Deuda total"
                    value={formatMoney(account.totalDebt)}
                    icon={AccountBalanceWalletOutlined}
                    color={account.overLimit ? 'error' : 'warning'}
                />
                <StatsCard
                    label="Crédito disponible"
                    value={formatMoney(account.availableCredit)}
                    icon={SavingsOutlined}
                    color="success"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        <ReceiptLongOutlined sx={{mr: 1}}/> Notas pendientes
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary', ...pageContainerStyles.contentSubtitle}}>
                        De la más vieja a la más nueva. Los abonos se aplican en este orden.
                    </Typography>
                </Box>
                <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 1.5, p: {xs: 1.5, sm: 2}}}>
                    {account.pendingNotes.length === 0 ? (
                        <Typography sx={customerAccountStyles.emptyState}>
                            Este cliente no tiene saldo pendiente
                        </Typography>
                    ) : account.pendingNotes.map((note) => (
                        <PendingNoteCard
                            key={note.saleId}
                            note={note}
                            isAdmin={isAdmin}
                            onPayNote={(selected) => setPaymentDialog({mode: 'note', note: selected})}
                            onPaymentAction={setPaymentAction}
                        />
                    ))}
                </CardContent>
            </Card>

            {paymentDialog && (
                <PaymentDialog
                    mode={paymentDialog.mode}
                    customerId={account.customerId}
                    customerName={account.name}
                    account={account}
                    note={paymentDialog.note}
                    onClose={() => setPaymentDialog(null)}
                    onCompleted={reload}
                />
            )}

            {isCreditDialogOpen && (
                <CreditLimitDialog
                    customerId={account.customerId}
                    customerName={account.name}
                    creditLimit={account.creditLimit}
                    totalDebt={account.totalDebt}
                    onClose={() => setIsCreditDialogOpen(false)}
                    onCompleted={reload}
                />
            )}

            <PaymentActionDialogs
                action={paymentAction}
                onClose={() => setPaymentAction(null)}
                onChanged={reload}
            />
        </Container>
    );
};
