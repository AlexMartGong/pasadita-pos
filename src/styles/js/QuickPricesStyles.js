// Estilos reutilizables para la vista "Precios Rápidos" (edición táctil mobile-first).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.

export const quickPricesStyles = {
    // Contenedor general de la vista, centrado y acotado en pantallas grandes.
    page: {
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        px: {xs: 1.5, sm: 2, md: 3},
        pt: {xs: 1, md: 2},
        pb: 4,
    },

    // Encabezado: icono + título + contador.
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 2,
    },

    headerIconWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 2,
        flexShrink: 0,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: '#fff',
    },

    // Buscador pegajoso: queda visible al hacer scroll del listado.
    searchBox: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: '#f5f5f5',
        py: 1,
        mb: 1,
    },

    // Tarjeta de producto.
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.08)',
    },

    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 2,
        pt: 1.5,
    },

    cardHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.25,
        textAlign: 'center',
        mb: 1.5,
    },

    avatar: {
        width: '100%',
        height: {xs: 110, sm: 130},
        borderRadius: '8px 8px 0 0',
        fontSize: {xs: '2.5rem', sm: '3rem'},
        fontWeight: 700,
        color: '#fff',
    },

    name: {
        fontWeight: 600,
        lineHeight: 1.2,
    },

    metaRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        mb: 1.5,
    },

    categoryChip: {
        color: '#fff',
        fontWeight: 600,
        height: 20,
        fontSize: '0.7rem',
    },

    // Fila de edición de precio: input + botón guardar, pegada al fondo de la tarjeta.
    priceRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        mt: 'auto',
    },

    // Input cómodo al tacto (altura generosa para dedos).
    priceInput: {
        '& .MuiOutlinedInput-root': {minHeight: 48},
    },

    // Touch target mínimo recomendado para móviles (>= 44x44px).
    saveButton: {
        minWidth: 48,
        minHeight: 48,
        px: 1.5,
        flexShrink: 0,
    },

    pagination: {
        display: 'flex',
        justifyContent: 'center',
        pt: 2,
    },

    empty: {
        py: 6,
        textAlign: 'center',
    },
};
