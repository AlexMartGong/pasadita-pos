import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, ReceiptLong} from "@mui/icons-material";
import {SaleTable} from "../../components/sale/SaleTable.jsx";

export const SalePage = () => {
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
