import {Box, Button, Typography, Paper, Container, Card, CardContent} from "@mui/material";
import {Add, People} from "@mui/icons-material";
import {UserTable} from "../components/user/UserTable.jsx";
import {NavLink} from "react-router-dom";
import {pageHeaderStyles} from "../styles/js/PageHeader.js";
import {pageContainerStyles} from "../styles/js/PageContainer.js";

export const UserPage = () => {
    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <People sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Usuarios
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra los usuarios del sistema de manera eficiente y segura
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/users/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}
                        >
                            Agregar Nuevo Usuario
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Usuarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza y gestiona todos los usuarios registrados en el sistema
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <UserTable/>
                </CardContent>
            </Card>
        </Container>
    );
};