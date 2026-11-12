// Estilos reutilizables para la vista "Nueva Venta" (layout asimétrico catálogo + panel de ticket).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.
//
// Lenguaje visual: un solo verde institucional sobre superficies neutras, reglas finas y cifras
// tabulares. El único bloque saturado de la pantalla es "Cobrar Venta". Rojo y ámbar se reservan
// para estados (eliminar, crédito, báscula desconectada / advertencias, modo domicilio).

import {POS_GUTTER_PX} from './AppShellStyles';

// Paleta institucional de la vista POS (mismos neutros que la libreta de abonos).
export const posPalette = {
    green: '#2e7d32',
    greenDark: '#1b5e20',
    greenTint: '#e8f5e9',
    amberDark: '#e65100',
    amberTint: '#fff4e5',
    ground: '#f4f6f4',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    ink: '#1f2a24',
    muted: '#5f6b64',
    rule: 'rgba(31, 42, 36, 0.12)',
};

// Las columnas quedan acotadas a la ventana para que el scroll sea interno y el footer de
// totales permanezca siempre visible. El área principal aporta POS_GUTTER_PX arriba y abajo.
const POS_VERTICAL_OFFSET = POS_GUTTER_PX * 2;

// Mapa de color por categoría de producto (datos reales del backend). Es identidad de la
// categoría (placeholder del Avatar y punto de color), no color de la interfaz.
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

// Abreviaturas de unidad para precios y cantidades ("$25 / kg").
const UNIT_LABELS = {
    KILOGRAMO: 'kg',
    PIEZA: 'pza',
    CAJA: 'caja',
    ARPILLA: 'arpilla',
    PORCION: 'porción',
    GRAMO: 'g',
    LITRO: 'L',
    MILILITRO: 'ml',
};

export const categoryColor = (category) => CATEGORY_COLORS[category] || '#546e7a';
export const categoryLabel = (category) => CATEGORY_LABELS[category] || category || 'Sin categoría';
export const unitLabel = (unitMeasure) => UNIT_LABELS[unitMeasure] || 'unidad';

// Opciones de los filtros rápidos del catálogo.
export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({value, label}));

// Iniciales para el Avatar (placeholder de imagen futura): hasta 2 palabras del nombre.
export const productInitials = (name = '') => {
    // Se descartan paréntesis y símbolos para no mostrar iniciales como "T(".
    const words = name.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

// Menús de los Select de la vista: opciones con altura táctil.
export const touchMenuProps = {
    slotProps: {
        paper: {
            sx: {
                maxHeight: 420,
                '& .MuiMenuItem-root': {minHeight: 48},
            },
        },
    },
};

const RULE = `1px solid ${posPalette.rule}`;

// Base de las dos columnas: superficie blanca con borde fino que llena el alto disponible.
const panelBase = {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    borderColor: posPalette.rule,
    backgroundColor: posPalette.surface,
};

// Etiqueta de sección: versalitas pequeñas, como los rótulos de una nota.
const sectionLabel = {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: posPalette.muted,
    lineHeight: 1.4,
};

// Retroalimentación táctil (el ripple está desactivado en el tema).
const pressFeedback = {
    transition: 'transform .12s ease, background-color .12s ease, border-color .12s ease, box-shadow .12s ease',
    '&:active': {transform: 'scale(0.97)'},
};

export const saleFormStyles = {
    // ── Layout general ──────────────────────────────────────────────────────

    // Contenedor general de la vista: en md+ ocupa exactamente la ventana (sin scroll de página).
    pageContainer: {
        height: {xs: 'auto', md: `calc(100vh - ${POS_VERTICAL_OFFSET}px)`},
        '@supports (height: 100dvh)': {
            height: {xs: 'auto', md: `calc(100dvh - ${POS_VERTICAL_OFFSET}px)`},
        },
    },

    layoutGrid: {
        height: {md: '100%'},
    },

    layoutColumn: {
        height: {md: '100%'},
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
    },

    // Columna izquierda (~70%): catálogo de productos.
    leftPanel: {
        ...panelBase,
        overflow: 'hidden',
    },

    // Columna derecha (~30%): panel de ticket. Un solo contenedor con secciones apiladas; el
    // carrito toma el alto restante. El scroll propio es solo una red de seguridad para pantallas
    // muy bajas con varias alertas de crédito.
    rightPanel: {
        ...panelBase,
        overflowX: 'hidden',
        overflowY: 'auto',
    },

    // Cifras: dígitos de ancho fijo para que precios, pesos y totales se alineen.
    amount: {
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
    },

    sectionLabel,

    // ── Catálogo ────────────────────────────────────────────────────────────

    // Barra del catálogo: buscador + filtros de categoría (se acomodan en una o dos filas).
    catalogToolbar: {
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        pt: 2,
        pb: 1.5,
        backgroundColor: posPalette.surfaceAlt,
        borderBottom: RULE,
    },

    // Barra de búsqueda: altura táctil (56px) y fuente cómoda.
    searchInput: {
        flex: '1 1 260px',
        '& .MuiOutlinedInput-root': {
            backgroundColor: posPalette.surface,
            borderRadius: 2,
            pr: 0.5,
        },
        '& .MuiInputBase-input': {
            fontSize: '1rem',
        },
    },

    // Botones dentro de campos (limpiar búsqueda, recapturar peso): área táctil de 44x44px.
    fieldIconButton: {
        width: 44,
        height: 44,
    },

    categoryChips: {
        flex: '2 1 420px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
    },

    // Chip de filtro: 40px de alto. Seleccionado = verde relleno.
    categoryChip: (selected) => ({
        ...pressFeedback,
        height: 40,
        minHeight: 40,
        borderRadius: '20px',
        px: 0.75,
        fontSize: '0.95rem',
        fontWeight: 600,
        ...(selected
            ? {
                backgroundColor: posPalette.green,
                borderColor: posPalette.green,
                color: '#ffffff',
                '&.MuiChip-clickable:hover': {backgroundColor: posPalette.greenDark},
            }
            : {
                backgroundColor: posPalette.surface,
                borderColor: posPalette.rule,
                color: posPalette.ink,
                '&.MuiChip-clickable:hover': {backgroundColor: posPalette.greenTint},
            }),
    }),

    // Punto de color de la categoría (único rastro del color por categoría fuera del Avatar).
    categoryDot: {
        display: 'inline-block',
        flexShrink: 0,
        width: 8,
        height: 8,
        borderRadius: '50%',
    },

    // El punto dentro de un chip seleccionado lleva aro blanco para no perderse sobre el verde.
    categoryChipDot: (selected) => ({
        display: 'inline-block',
        flexShrink: 0,
        width: 10,
        height: 10,
        borderRadius: '50%',
        boxShadow: selected ? '0 0 0 2px rgba(255, 255, 255, 0.9)' : 'none',
    }),

    // Zona scrollable del grid de tarjetas dentro del catálogo.
    catalogGridScroll: {
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 2,
        pb: 1,
        backgroundColor: posPalette.surface,
    },

    catalogEmpty: {
        color: posPalette.muted,
        py: 6,
        textAlign: 'center',
    },

    // Pie del catálogo: conteo a la izquierda y paginación centrada.
    catalogFooter: {
        flexShrink: 0,
        display: 'grid',
        gridTemplateColumns: {xs: '1fr', sm: '1fr auto 1fr'},
        alignItems: 'center',
        justifyItems: {xs: 'center', sm: 'stretch'},
        gap: 1,
        minHeight: 60,
        px: 2,
        py: 1,
        borderTop: RULE,
        backgroundColor: posPalette.surfaceAlt,
    },

    catalogCount: {
        color: posPalette.muted,
        fontVariantNumeric: 'tabular-nums',
    },

    // Paginación táctil: botones de 44px, página activa en verde.
    paginationTouch: {
        '& .MuiPaginationItem-root': {
            minWidth: 44,
            height: 44,
            borderRadius: '22px',
            fontSize: '1rem',
            fontVariantNumeric: 'tabular-nums',
        },
        '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: posPalette.green,
            color: '#ffffff',
            fontWeight: 700,
            '&:hover': {backgroundColor: posPalette.greenDark},
        },
    },

    // Tarjeta de producto: plana, borde fino. El hover solo aplica con puntero; al toque responde
    // con una ligera compresión.
    productCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2.5,
        border: RULE,
        backgroundColor: posPalette.surface,
        overflow: 'hidden',
        transition: 'transform .12s ease, border-color .12s ease, box-shadow .12s ease',
        '@media (hover: hover)': {
            '&:hover': {
                borderColor: posPalette.green,
                boxShadow: '0 6px 16px rgba(27, 94, 32, 0.12)',
            },
        },
        '&:active': {
            transform: 'scale(0.98)',
            borderColor: posPalette.green,
        },
    },

    productCardAction: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },

    // Foto del producto (o iniciales sobre el color de la categoría si no hay imagen).
    productAvatar: {
        width: '100%',
        height: {xs: 110, sm: 120, xl: 108},
        fontSize: {xs: '2.5rem', sm: '2.75rem'},
        fontWeight: 700,
        color: 'white',
    },

    productCardContent: {
        width: '100%',
        textAlign: 'center',
        p: 1.25,
        '&:last-child': {pb: 1.25},
    },

    productName: {
        fontWeight: 600,
        minHeight: '2.4em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.2,
        color: posPalette.ink,
    },

    productPrice: {
        mt: 0.5,
        fontWeight: 800,
        fontSize: '1.15rem',
        color: posPalette.greenDark,
        lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
    },

    productUnit: {
        fontSize: '0.8rem',
        fontWeight: 500,
        color: posPalette.muted,
    },

    productMeta: {
        mt: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        fontSize: '0.75rem',
        lineHeight: 1.4,
        color: posPalette.muted,
    },

    // ── Panel de ticket: barra superior ─────────────────────────────────────

    // Sesión + tipo de operación (ADMIN) + "Abrir Caja".
    panelHeader: {
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        minHeight: 60,
        px: 1.5,
        py: 1,
        backgroundColor: posPalette.surfaceAlt,
        borderBottom: RULE,
    },

    userChip: {
        maxWidth: 170,
        height: 36,
        borderRadius: '18px',
        borderColor: posPalette.rule,
        backgroundColor: posPalette.surface,
        color: posPalette.ink,
        fontWeight: 600,
        '& .MuiChip-icon': {color: posPalette.green},
    },

    // Hueco central de la barra: aloja el selector de tipo de operación.
    panelHeaderSlot: {
        flex: '1 1 auto',
        minWidth: 0,
        display: 'flex',
        justifyContent: 'center',
    },

    drawerButton: {
        ...pressFeedback,
        width: 44,
        height: 44,
        border: RULE,
        backgroundColor: posPalette.surface,
        color: posPalette.green,
        '&:hover': {
            backgroundColor: posPalette.greenTint,
            borderColor: posPalette.green,
        },
    },

    operationToggleGroup: {
        backgroundColor: posPalette.surface,
    },

    // Caja = verde institucional; Domicilio = ámbar (modo domicilio activo).
    operationToggleButton: (tone) => {
        const selected = tone === 'pedido'
            ? {backgroundColor: posPalette.amberTint, color: posPalette.amberDark}
            : {backgroundColor: posPalette.greenTint, color: posPalette.greenDark};

        return {
            minHeight: 44,
            px: 1.5,
            gap: 0.75,
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            lineHeight: 1.2,
            color: posPalette.muted,
            borderColor: posPalette.rule,
            '&.Mui-selected': {
                ...selected,
                '&:hover': selected,
            },
        };
    },

    // ── Panel de ticket: datos de la venta ──────────────────────────────────

    panelSection: {
        flexShrink: 0,
        px: 1.5,
        pt: 1.75,
        pb: 1,
        borderBottom: RULE,
    },

    // Cliente y método de pago: dos columnas cuando el panel tiene ancho, apilados si no.
    // Se resuelve con el ancho real del panel (cambia al expandir el Sidebar), no con breakpoints.
    fieldRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
    },

    customerField: {
        flex: '1.3 1 190px',
        minWidth: 0,
    },

    paymentField: {
        flex: '1 1 160px',
        minWidth: 0,
    },

    // Select compacto con altura táctil (48px).
    touchField: {
        '& .MuiInputBase-root': {
            minHeight: 48,
        },
        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
            transform: 'translate(14px, 13px) scale(1)',
        },
    },

    saleInfoMeta: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        minHeight: 40,
        mt: 0.5,
    },

    customerDiscount: {
        color: posPalette.muted,
        fontVariantNumeric: 'tabular-nums',
    },

    noteButton: {
        ml: 'auto',
        minHeight: 40,
        px: 1.25,
        textTransform: 'none',
        fontWeight: 600,
    },

    notesField: {
        mt: 1,
        mb: 0.75,
    },

    // ── Panel de ticket: pedido a domicilio ─────────────────────────────────

    // Acento ámbar: señala que el modo domicilio está activo.
    deliverySection: {
        flexShrink: 0,
        px: 1.5,
        py: 0.25,
        borderBottom: RULE,
        borderLeft: '4px solid',
        borderLeftColor: 'warning.main',
        backgroundColor: '#fffaf3',
    },

    deliveryHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minHeight: 44,
    },

    deliveryIcon: {
        color: 'warning.main',
        fontSize: 22,
    },

    deliveryTitle: {
        flexGrow: 1,
        minWidth: 0,
        fontSize: '0.95rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: posPalette.ink,
    },

    deliverySubtitle: {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 400,
        color: posPalette.muted,
    },

    sectionToggle: {
        width: 44,
        height: 44,
        color: posPalette.muted,
    },

    // Dirección y teléfono en una fila si caben; si no, uno debajo del otro.
    deliveryDetails: {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: 2,
        rowGap: 0.5,
        pb: 0.75,
    },

    deliveryDetail: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0.75,
        minWidth: 0,
        flex: '1 1 180px',
        color: posPalette.ink,
        '& .MuiSvgIcon-root': {
            mt: '1px',
            fontSize: 18,
            color: posPalette.muted,
        },
    },

    deliveryDetailPhone: {
        flex: '0 1 auto',
        fontVariantNumeric: 'tabular-nums',
    },

    deliveryDetailEmpty: {
        color: posPalette.muted,
        fontStyle: 'italic',
    },

    // Crédito del cliente: siempre visible, aunque los datos de entrega estén colapsados.
    deliveryCredit: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        pb: 0.75,
    },

    creditRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
    },

    accountLink: {
        minHeight: 44,
        px: 1.25,
        textTransform: 'none',
        fontWeight: 600,
    },

    compactAlert: {
        py: 0,
        alignItems: 'center',
        '& .MuiAlert-message': {py: 0.75},
        '& .MuiAlert-icon': {py: 0.75},
    },

    // ── Panel de ticket: carrito ────────────────────────────────────────────

    // Sección del carrito: ocupa el alto restante del panel y aloja el scroll + footer.
    cartSection: {
        flex: {xs: '1 1 auto', md: '1 1 0'},
        minHeight: {xs: 0, md: 260},
        display: 'flex',
        flexDirection: 'column',
    },

    cartHeader: {
        flexShrink: 0,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 1,
        px: 2,
        pt: 1.25,
        pb: 0.5,
    },

    cartCount: {
        color: posPalette.muted,
        fontVariantNumeric: 'tabular-nums',
    },

    // Lista del carrito (flex:1, scroll interno). El scroll vive en el TableContainer para que
    // el encabezado pegajoso de la tabla funcione.
    cartScroll: {
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
    },

    cartTable: {
        tableLayout: 'fixed',
        '& .MuiTableCell-head': {
            ...sectionLabel,
            fontSize: '0.7rem',
            py: 0.75,
            px: 1,
            backgroundColor: posPalette.surface,
            borderBottom: RULE,
        },
        '& .MuiTableCell-body': {
            py: 1,
            px: 1,
            height: 60,
            borderBottom: `1px dashed ${posPalette.rule}`,
            color: posPalette.ink,
        },
        '& .MuiTableCell-root:first-of-type': {
            pl: 2,
        },
        '& .MuiTableCell-root:last-of-type': {
            pr: 1.5,
        },
    },

    cartQuantityColumn: {width: 76},
    cartTotalColumn: {width: 96},
    cartActionColumn: {width: 76},

    cartProductName: {
        fontWeight: 700,
        lineHeight: 1.25,
        overflowWrap: 'anywhere',
    },

    cartProductMeta: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 1,
        rowGap: 0.25,
        mt: 0.25,
        color: posPalette.muted,
        fontSize: '0.8rem',
        lineHeight: 1.4,
        fontVariantNumeric: 'tabular-nums',
    },

    // Etiqueta de descuento de la línea: rojo, solo cuando hay descuento.
    discountTag: {
        display: 'inline-block',
        px: 0.75,
        borderRadius: 1,
        fontSize: '0.72rem',
        fontWeight: 700,
        lineHeight: 1.5,
        color: 'error.main',
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
    },

    cartQuantity: {
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
    },

    cartLineTotal: {
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
    },

    // Botón eliminar: área táctil de 44x44px.
    deleteButton: {
        ...pressFeedback,
        width: 44,
        height: 44,
    },

    cartEmpty: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        py: 5,
        px: 2,
        color: posPalette.muted,
        textAlign: 'center',
        '& .MuiSvgIcon-root': {
            fontSize: 40,
            opacity: 0.45,
        },
    },

    // Footer pinneado: totales + botones de acción, siempre visibles.
    ticketFooter: {
        flexShrink: 0,
        borderTop: RULE,
        backgroundColor: posPalette.surface,
        px: 2,
        pt: 1.5,
        pb: 2,
    },

    totalsBox: {
        mb: 1.5,
    },

    // Renglón del desglose (Subtotal / Descuento): solo aparece cuando hay descuento.
    totalsRow: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.25,
        fontSize: '0.95rem',
        color: posPalette.muted,
        fontVariantNumeric: 'tabular-nums',
    },

    totalsRowDiscount: {
        color: 'error.main',
        fontWeight: 600,
    },

    totalRow: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 2,
    },

    totalLabel: {
        ...sectionLabel,
        fontSize: '0.85rem',
    },

    totalAmount: {
        fontSize: '2.25rem',
        fontWeight: 800,
        lineHeight: 1.1,
        color: posPalette.ink,
        fontVariantNumeric: 'tabular-nums',
    },

    cartError: {
        color: 'error.main',
        mb: 1,
    },

    // ── Ergonomía táctil ────────────────────────────────────────────────────

    // Botones de acción principales: altura táctil (≥48px) y tipografía legible.
    touchButton: {
        minHeight: 50,
        fontSize: '1.05rem',
    },

    // Fila de botones del footer del ticket (Cancelar / Cobrar).
    cartActions: {
        display: 'flex',
        gap: 1.5,
    },

    cartCancelButton: {
        flex: '1 1 0',
        minWidth: 0,
        minHeight: 56,
        px: 1,
        color: posPalette.muted,
        borderColor: posPalette.rule,
    },

    // Acción principal de la vista: el elemento de mayor peso visual.
    primaryAction: {
        ...pressFeedback,
        flex: '2 1 0',
        minHeight: 56,
        fontSize: '1.15rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        boxShadow: 'none',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.24)',
        },
    },

    // ── Diálogos del flujo de venta ─────────────────────────────────────────

    // Encabezado institucional: verde plano, sin gradiente.
    dialogTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: posPalette.green,
        color: '#ffffff',
        fontWeight: 700,
    },

    // MUI anula el padding superior del contenido que sigue al título; se recupera con la misma
    // especificidad.
    dialogContent: {
        '.MuiDialogTitle-root + &': {pt: 3},
        pb: 2,
    },

    // Acciones de los diálogos: separación táctil amplia.
    dialogActions: {
        px: 3,
        pb: 2,
        gap: 1.5,
    },

    productSummary: {
        p: 2,
        borderRadius: 2,
        borderColor: posPalette.rule,
        backgroundColor: posPalette.surfaceAlt,
    },

    productSummaryDiscount: {
        display: 'block',
        mt: 0.5,
        color: 'error.main',
        fontVariantNumeric: 'tabular-nums',
    },

    totalHighlight: {
        textAlign: 'center',
        py: 2,
        borderRadius: 2,
        backgroundColor: posPalette.greenTint,
        border: '1px solid rgba(46, 125, 50, 0.35)',
    },

    totalHighlightAmount: {
        fontWeight: 800,
        lineHeight: 1.1,
        color: posPalette.greenDark,
        fontVariantNumeric: 'tabular-nums',
    },

    // ── Captura de cantidad ─────────────────────────────────────────────────

    quantityRow: {
        display: 'flex',
        alignItems: 'stretch',
        gap: 1,
    },

    // Campo de cantidad: cifra grande y centrada, fácil de leer a un brazo de distancia.
    quantityInput: {
        '& .MuiInputBase-root': {
            minHeight: 64,
        },
        '& .MuiInputBase-input': {
            fontSize: '1.6rem',
            fontWeight: 700,
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
        },
        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
            transform: 'translate(14px, 20px) scale(1)',
        },
    },

    // Botones − / + que flanquean el campo.
    stepButton: {
        ...pressFeedback,
        flexShrink: 0,
        width: 56,
        minHeight: 56,
        borderRadius: 2,
        border: RULE,
        backgroundColor: posPalette.surface,
        color: posPalette.ink,
        '&:hover': {
            backgroundColor: posPalette.greenTint,
            borderColor: posPalette.green,
        },
        '&.Mui-disabled': {
            borderColor: posPalette.rule,
        },
    },

    quickChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
    },

    // Chip de incremento rápido (+0.25, +0.5, …): 44px de alto.
    quickChip: {
        ...pressFeedback,
        flex: '1 1 0',
        height: 44,
        minHeight: 44,
        minWidth: 72,
        borderRadius: '22px',
        fontSize: '1rem',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: posPalette.ink,
        borderColor: posPalette.rule,
        backgroundColor: posPalette.surface,
        '&.MuiChip-clickable:hover': {
            backgroundColor: posPalette.greenTint,
            borderColor: posPalette.green,
        },
    },

    scaleStatus: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        gap: 1,
    },

    scaleChip: {
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
    },
};
