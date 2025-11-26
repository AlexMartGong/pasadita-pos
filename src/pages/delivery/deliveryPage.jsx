import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, LocalShipping, ShoppingCart, AttachMoney} from "@mui/icons-material";
import {DeliveryTable} from "../../components/delivery/deliveryTable.jsx";
import {useDeliveryOrder} from "../../hooks/deliveryOrder/useDeliveryOrder.js";
import {formatCurrency} from "../../utils/formatters.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";

export const DeliveryPage = () => {
    const {totalOrders, totalAmount} = useDeliveryOrder();

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <LocalShipping sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Entregas
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra las órdenes de entrega de manera eficiente y segura
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
                            Nueva Orden de Entrega
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <StatsCardContainer>
                <StatsCard
                    label="Total de Órdenes"
                    value={totalOrders}
                    icon={ShoppingCart}
                    color="primary"
                />
                <StatsCard
                    label="Monto Total"
                    value={formatCurrency(totalAmount)}
                    icon={AttachMoney}
                    color="success"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Órdenes de Entrega
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todas las órdenes de entrega registradas en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <DeliveryTable/>
                </CardContent>
            </Card>
        </Container>
    );
}
