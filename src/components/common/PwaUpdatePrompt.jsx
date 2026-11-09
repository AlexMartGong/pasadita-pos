import {Alert, Button, Snackbar, Typography} from "@mui/material";
import {SystemUpdateAlt} from "@mui/icons-material";
import {usePwaUpdate} from "../../hooks/pwa/usePwaUpdate.js";
import {pwaUpdatePromptStyles} from "../../styles/js/PwaUpdatePromptStyles.js";

/**
 * Aviso persistente de versión nueva de la PWA. Sin onClose ni botón de cerrar: se queda hasta que el usuario
 * pulse "Actualizar", que es cuando decide recargar (p. ej. después de cobrar el carrito en curso).
 * Abajo a la izquierda para no tapar el pie fijo de ShoppingCart ("Cobrar Venta"/"Cancelar") en /sale/register.
 */
export const PwaUpdatePrompt = () => {
    const {needRefresh, updateApp} = usePwaUpdate();

    return (
        <Snackbar
            open={needRefresh}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        >
            <Alert
                severity="info"
                variant="filled"
                icon={<SystemUpdateAlt fontSize="inherit"/>}
                sx={pwaUpdatePromptStyles.alert}
                action={
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={updateApp}
                        sx={pwaUpdatePromptStyles.button}
                    >
                        Actualizar
                    </Button>
                }
            >
                <Typography variant="body1" sx={pwaUpdatePromptStyles.message}>
                    Hay una nueva versión disponible
                </Typography>
            </Alert>
        </Snackbar>
    );
};
