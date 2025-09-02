import {NavLink} from "react-router-dom";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {Add, People} from "@mui/icons-material";
import {CustomerTable} from "../../components/customer/CustomerTable.jsx";

export const CustomerPage = () => {
    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <People sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Clientes
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra los clientes de manera eficiente y segura
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/customer/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}>
                            Agregar Nuevo Cliente
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Clientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todos los clientes registrados en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <CustomerTable/>
                </CardContent>
            </Card>
        </Container>
    );
}
