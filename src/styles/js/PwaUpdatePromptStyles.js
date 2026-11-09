// Estilos del aviso "Hay una nueva versión disponible" (PwaUpdatePrompt).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.

export const pwaUpdatePromptStyles = {
    // Tarjeta del aviso: info sólido, esquinas suaves y sombra marcada para que se distinga sobre cualquier vista.
    alert: {
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        py: 0.75,
        pl: 2,
        pr: 1.5,
        '& .MuiAlert-icon': {
            fontSize: 26,
            opacity: 1,
            py: 0,
        },
        '& .MuiAlert-message': {
            py: 0,
        },
        '& .MuiAlert-action': {
            pt: 0,
            pl: 2,
            mr: 0,
        },
    },

    // Texto principal del aviso.
    message: {
        fontWeight: 600,
        lineHeight: 1.3,
    },

    // Botón "Actualizar": contorno blanco de alto contraste y área táctil ≥48px.
    button: {
        minHeight: 48,
        px: 2.5,
        fontWeight: 700,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.85)',
        whiteSpace: 'nowrap',
        '&:hover': {
            borderWidth: 2,
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
        },
    },
};
