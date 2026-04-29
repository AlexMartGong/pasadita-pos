import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, ReceiptLong} from "@mui/icons-material";
import {CustomerFiscalDataTable} from "../../components/customerFiscalData/CustomerFiscalDataTable.jsx";

export const CustomerFiscalDataPage = () => {
    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <ReceiptLong sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Datos Fiscales
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra los perfiles fiscales para CFDI 4.0
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/customer-fiscal-data/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}>
                            Nuevo Perfil Fiscal
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Perfiles Fiscales
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todos los datos fiscales registrados en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <CustomerFiscalDataTable/>
                </CardContent>
            </Card>
        </Container>
    );
}
