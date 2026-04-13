import {useState, useCallback} from "react";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {PendingActions, ShoppingCart, AttachMoney} from "@mui/icons-material";
import {PendingTable} from "../../components/delivery/PendingTable.jsx";
import {formatCurrency} from "../../utils/formatters.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";

export const PendingDeliveryPage = () => {
    const [stats, setStats] = useState({pendingCount: 0, totalOwed: 0});

    const handleStatsChange = useCallback(({pendingCount, totalOwed}) => {
        setStats({pendingCount, totalOwed});
    }, []);

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <PendingActions sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Pedidos Pendientes
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Visualiza y gestiona los pedidos pendientes de pago
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <StatsCardContainer>
                <StatsCard
                    label="Pedidos por pagar"
                    value={stats.pendingCount}
                    icon={ShoppingCart}
                    color="warning"
                />
                <StatsCard
                    label="Cuanto se debe"
                    value={formatCurrency(stats.totalOwed)}
                    icon={AttachMoney}
                    color="error"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Pedidos Pendientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Pedidos de entrega que aun no han sido pagados
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <PendingTable onStatsChange={handleStatsChange}/>
                </CardContent>
            </Card>
        </Container>
    );
};
