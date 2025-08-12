import {Box, Button, Typography, Paper, Container, Card, CardContent} from "@mui/material";
import {Add, People} from "@mui/icons-material";
import {UserTable} from "../components/user/UserTable.jsx";
import {NavLink} from "react-router-dom";
import {pageHeaderStyles} from "../styles/PageHeader.js";
import {statsCardStyles} from "../styles/StatsCards.js";
import {pageContainerStyles} from "../styles/PageContainer.js";

export const UserPage = () => {
    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            {/* Header Section */}
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <People sx={pageHeaderStyles.icon} />
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
                            startIcon={<Add />}
                            sx={pageHeaderStyles.actionButton}
                        >
                            Agregar Nuevo Usuario
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Stats Cards Section */}
            <Box sx={statsCardStyles.container}>
                <Card elevation={3} sx={statsCardStyles.card}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2" sx={statsCardStyles.label}>
                            Total de Usuarios
                        </Typography>
                        <Typography variant="h4" component="div" sx={{...statsCardStyles.value, color: statsCardStyles.colors.primary}}>
                            {/* Este valor se puede conectar con un estado global o prop */}
                            --
                        </Typography>
                    </CardContent>
                </Card>

                <Card elevation={3} sx={statsCardStyles.card}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2" sx={statsCardStyles.label}>
                            Usuarios Activos
                        </Typography>
                        <Typography variant="h4" component="div" sx={{...statsCardStyles.value, color: statsCardStyles.colors.success}}>
                            --
                        </Typography>
                    </CardContent>
                </Card>

                <Card elevation={3} sx={statsCardStyles.card}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2" sx={statsCardStyles.label}>
                            Roles Asignados
                        </Typography>
                        <Typography variant="h4" component="div" sx={{...statsCardStyles.value, color: statsCardStyles.colors.info}}>
                            --
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Main Content Section */}
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
                    <UserTable />
                </CardContent>
            </Card>
        </Container>
    );
};