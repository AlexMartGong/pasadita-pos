// Estilos reutilizables para la vista "Nueva Venta" (layout asimétrico catálogo + panel de ticket).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.

// Altura de trabajo de las columnas. Ambas columnas quedan acotadas a la ventana
// para que el scroll sea interno y el footer de totales permanezca siempre visible.
const PANEL_HEIGHT = {xs: 'auto', md: 'calc(100vh - 150px)'};

// Mapa de color por categoría de producto (datos reales del backend).
const CATEGORY_COLORS = {
    FRUTAS: '#ef6c00',
    VERDURAS: '#2e7d32',
    HIERBAS: '#558b2f',
    CHILES: '#c62828',
    GRANOS_CEREALES: '#8d6e63',
    FRUTOS_SECOS: '#6d4c41',
};

// Etiquetas legibles (mismos valores que src/hooks/product/useProduct.js).
const CATEGORY_LABELS = {
    FRUTAS: 'Fruta',
    VERDURAS: 'Verdura',
    HIERBAS: 'Hierba',
    CHILES: 'Chile',
    GRANOS_CEREALES: 'Grano Cereal',
    FRUTOS_SECOS: 'Fruto Seco',
};

export const categoryColor = (category) => CATEGORY_COLORS[category] || '#546e7a';
export const categoryLabel = (category) => CATEGORY_LABELS[category] || category || 'Sin categoría';

// Iniciales para el Avatar (placeholder de imagen futura): hasta 2 palabras del nombre.
export const productInitials = (name = '') => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

export const saleFormStyles = {
    // Contenedor general de la vista.
    pageContainer: {
        flexGrow: 1,
        p: {xs: 2, md: 3},
        backgroundColor: '#fafbfc',
    },

    // Columna izquierda (~70%): catálogo de productos.
    leftPanel: {
        height: PANEL_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
    },

    // Columna derecha (~30%): panel de ticket, flex column con footer pinneable.
    rightPanel: {
        height: PANEL_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflow: {xs: 'visible', md: 'hidden'},
    },

    // Zona scrollable del grid de tarjetas dentro del catálogo.
    catalogGridScroll: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        pr: 0.5,
    },

    // Control de paginación del catálogo: fijo bajo el grid, centrado.
    catalogPagination: {
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        pt: 1.5,
    },

    // Tarjeta de producto.
    productCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.08)',
        transition: 'transform .15s ease, box-shadow .15s ease',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 4,
        },
    },

    productCardAction: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },

    productAvatar: {
        width: '100%',
        height: {xs: 120, sm: 140},
        borderRadius: '8px 8px 0 0', // esquinas superiores redondeadas (igual que la tarjeta), base recta
        fontSize: {xs: '2.75rem', sm: '3.25rem'},
        fontWeight: 700,
        color: 'white',
    },

    productPrice: {
        fontWeight: 800,
        fontSize: '1.15rem',
        color: '#1b5e20',
        lineHeight: 1.1,
    },

    // Tarjeta del carrito: ocupa el espacio restante del panel y aloja el scroll + footer.
    cartCard: {
        flexGrow: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(48, 63, 159, 0.15)',
    },

    // Lista del carrito (flex:1, scroll interno).
    cartScroll: {
        flexGrow: 1,
        minHeight: 0,
        overflow: 'auto',
    },

    // Footer pinneado: totales + botones de acción, siempre visibles.
    ticketFooter: {
        flexShrink: 0,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: '#ffffff',
        p: 2,
    },

    totalsBox: {
        mb: 1.5,
        textAlign: 'right',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        p: 1.5,
    },
};
