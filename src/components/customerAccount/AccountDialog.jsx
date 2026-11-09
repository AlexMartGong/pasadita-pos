import {useRef} from 'react';
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery, useTheme
} from '@mui/material';
import {Close} from '@mui/icons-material';
import {customerAccountStyles} from '../../styles/js/CustomerAccountStyles.js';

// Cascarón común de los diálogos de abonos y crédito: pantalla completa en celular (U8), título con gradiente
// de la casa y banner "Reintentar" ante errores de red (U5).
export const AccountDialog = ({
                                  title,
                                  subtitle,
                                  icon: Icon,
                                  tone = 'default',
                                  maxWidth = 'sm',
                                  busy = false,
                                  networkError = false,
                                  onRetry,
                                  onClose,
                                  actions,
                                  children,
                              }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const contentRef = useRef(null);

    // El campo con autoFocus recibe el foco al montar, pero el DataGrid lo devuelve enseguida a la celda del
    // botón que abrió el diálogo. Al terminar la transición de entrada se vuelve a enfocar el campo marcado.
    const handleEntered = () => {
        contentRef.current?.querySelector('[data-autofocus="true"]')?.focus();
    };

    return (
        <Dialog
            open
            onClose={busy ? undefined : onClose}
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            fullWidth
            slotProps={{transition: {onEntered: handleEntered}}}
        >
            <DialogTitle sx={customerAccountStyles.dialogTitle(tone)}>
                {Icon && <Icon/>}
                <Box sx={{minWidth: 0}}>
                    <Box component="span" sx={customerAccountStyles.dialogTitleText}>{title}</Box>
                    {subtitle && (
                        <Typography component="span" sx={customerAccountStyles.dialogSubtitle}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <IconButton aria-label="Cerrar" onClick={onClose} disabled={busy} sx={customerAccountStyles.dialogClose}>
                    <Close/>
                </IconButton>
            </DialogTitle>

            <DialogContent ref={contentRef} sx={customerAccountStyles.dialogContent}>
                {networkError && (
                    <Alert
                        severity="error"
                        action={onRetry && (
                            <Button color="inherit" size="small" onClick={onRetry} disabled={busy}
                                    sx={{fontWeight: 700}}>
                                Reintentar
                            </Button>
                        )}
                    >
                        No hubo respuesta del servidor. Reintenta: la operación no se registrará dos veces.
                    </Alert>
                )}
                {children}
            </DialogContent>

            {actions && (
                <DialogActions sx={customerAccountStyles.dialogActions}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};
