import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, ReceiptLong, ShoppingCart, AttachMoney} from "@mui/icons-material";
import {SaleTable} from "../../components/sale/SaleTable.jsx";
import {useSale} from "../../hooks/sale/useSale.js";
import {formatCurrency} from "../../utils/formatters.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";

export const SalePage = () => {
    const {totalSales, totalAmount} = useSale();

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <ReceiptLong sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Ventas
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra las ventas de manera eficiente y segura
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/sale/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}>
                            Nueva Venta
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <StatsCardContainer>
                <StatsCard
                    label="Ventas de Hoy"
                    value={totalSales}
                    icon={ShoppingCart}
                    color="primary"
                />
                <StatsCard
                    label="Monto Total (Pagado)"
                    value={formatCurrency(totalAmount)}
                    icon={AttachMoney}
                    color="success"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Ventas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todas las ventas registradas en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <SaleTable/>
                </CardContent>
            </Card>
        </Container>
    );
}
