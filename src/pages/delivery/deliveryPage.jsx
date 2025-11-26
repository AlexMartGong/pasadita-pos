import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {statsCardStyles} from "../../styles/js/StatsCards.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, LocalShipping, ShoppingCart, AttachMoney} from "@mui/icons-material";
import {DeliveryTable} from "../../components/delivery/deliveryTable.jsx";
import {useDeliveryOrder} from "../../hooks/deliveryOrder/useDeliveryOrder.js";
import {formatCurrency} from "../../utils/formatters.js";

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

            <Box sx={statsCardStyles.container}>
                <Card elevation={3} sx={{...statsCardStyles.card, borderLeft: `4px solid ${statsCardStyles.colors.primary}`}}>
                    <CardContent>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={statsCardStyles.label}>
                                    Total de Órdenes
                                </Typography>
                                <Typography variant="h4" sx={{...statsCardStyles.value, color: statsCardStyles.colors.primary}}>
                                    {totalOrders}
                                </Typography>
                            </Box>
                            <ShoppingCart sx={{fontSize: 48, color: statsCardStyles.colors.primary, opacity: 0.3}}/>
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={3} sx={{...statsCardStyles.card, borderLeft: `4px solid ${statsCardStyles.colors.success}`}}>
                    <CardContent>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={statsCardStyles.label}>
                                    Monto Total
                                </Typography>
                                <Typography variant="h4" sx={{...statsCardStyles.value, color: statsCardStyles.colors.success}}>
                                    {formatCurrency(totalAmount)}
                                </Typography>
                            </Box>
                            <AttachMoney sx={{fontSize: 48, color: statsCardStyles.colors.success, opacity: 0.3}}/>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

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
