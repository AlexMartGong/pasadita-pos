import {Avatar, Box, Button, Card, CardContent, CircularProgress, Typography} from "@mui/material";
import {Store} from "@mui/icons-material";
import {useSessionRestore} from "../../auth/hooks/useSessionRestore.js";
import {loginPageStyles} from "../../styles/js/LoginPageStyles.js";
import {sessionRestoreStyles} from "../../styles/js/SessionRestoreStyles.js";

export const SessionRestoreScreen = () => {
    const {failed, retry, goToLogin} = useSessionRestore();

    return (
        <Box sx={loginPageStyles.container}>
            <Card elevation={0} sx={loginPageStyles.card}>
                <CardContent sx={loginPageStyles.cardContent}>
                    <Box sx={loginPageStyles.header}>
                        <Avatar sx={loginPageStyles.avatar}>
                            <Store sx={loginPageStyles.storeIcon}/>
                        </Avatar>
                        <Typography variant="h5" component="h1" sx={loginPageStyles.title}>
                            La Pasadita
                        </Typography>
                        <Typography variant="body2" sx={loginPageStyles.subtitle}>
                            Punto de Venta para Frutería
                        </Typography>
                    </Box>

                    <Box sx={sessionRestoreStyles.status} role="status" aria-live="polite">
                        {failed ? (
                            <>
                                <Typography variant="body1" sx={sessionRestoreStyles.errorTitle}>
                                    No se pudo conectar con el servidor
                                </Typography>
                                <Typography variant="body2" sx={sessionRestoreStyles.message}>
                                    Revisa la conexión a internet e intenta de nuevo.
                                </Typography>
                                <Box sx={sessionRestoreStyles.actions}>
                                    <Button variant="contained" fullWidth onClick={retry}
                                            sx={loginPageStyles.loginButton}>
                                        Reintentar
                                    </Button>
                                    <Button variant="text" fullWidth onClick={goToLogin}
                                            sx={sessionRestoreStyles.secondaryButton}>
                                        Iniciar sesión
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <CircularProgress size={32} sx={sessionRestoreStyles.spinner}/>
                                <Typography variant="body2" sx={sessionRestoreStyles.message}>
                                    Recuperando tu sesión…
                                </Typography>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};
