import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, Category} from "@mui/icons-material";
import {CustomerTypeTable} from "../../components/customer/CustomerTypeTable.jsx";

export const CustomerTypePage = () => {
    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <Category sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Tipos de Cliente
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra los tipos de cliente con descuentos y clasificaciones
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/customer-type/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}>
                            Agregar Nuevo Tipo
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Tipos de Cliente
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todos los tipos de cliente registrados en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <CustomerTypeTable/>
                </CardContent>
            </Card>
        </Container>
    );
}
