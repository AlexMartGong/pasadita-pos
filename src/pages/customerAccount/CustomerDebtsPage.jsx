import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {AccountBalanceWalletOutlined, GroupOutlined, WarningAmberOutlined} from "@mui/icons-material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";
import {CustomerDebtsTable} from "../../components/customerAccount/CustomerDebtsTable.jsx";
import {useCustomerDebts} from "../../hooks/customerAccount/useCustomerDebts.js";
import {formatMoney} from "../../utils/money.js";

// 5.9 Clientes con saldo (ADMIN).
export const CustomerDebtsPage = () => {
    const navigate = useNavigate();
    const {debts, totalReceivable, loading} = useCustomerDebts();
    const overLimitCount = debts.filter((debt) => debt.overLimit).length;

    const handleOpenAccount = useCallback((customerId) => {
        navigate(`/customers/${customerId}/account`);
    }, [navigate]);

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <AccountBalanceWalletOutlined sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Clientes con saldo
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Quién debe y cuánto, de mayor a menor deuda
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <StatsCardContainer>
                <StatsCard
                    label="Total por cobrar"
                    value={formatMoney(totalReceivable)}
                    icon={AccountBalanceWalletOutlined}
                    color="warning"
                />
                <StatsCard
                    label="Clientes con saldo"
                    value={debts.length}
                    icon={GroupOutlined}
                    color="primary"
                />
                <StatsCard
                    label="Rebasaron su límite"
                    value={overLimitCount}
                    icon={WarningAmberOutlined}
                    color="error"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Cuentas por cobrar
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary', ...pageContainerStyles.contentSubtitle}}>
                        Toca un cliente para ver su estado de cuenta
                    </Typography>
                </Box>
                <CardContent sx={pageContainerStyles.contentBody}>
                    <CustomerDebtsTable debts={debts} loading={loading} onOpenAccount={handleOpenAccount}/>
                </CardContent>
            </Card>
        </Container>
    );
};
