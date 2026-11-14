// Estilos del diálogo "Calcular precio" (vista Precios Rápidos).
// Mismo lenguaje que el POS: superficies neutras, reglas finas, cifras tabulares, sin degradados.
// El único verde saturado del resultado es el precio sugerido; el único botón saturado, "Usar
// este precio".

import {posPalette, saleFormStyles} from './SaleFormStyles';

const RULE = `1px solid ${posPalette.rule}`;
const TABULAR = {fontVariantNumeric: 'tabular-nums'};

export const priceFormulaStyles = {
    paper: {
        borderRadius: {xs: 0, sm: 3},
    },

    // Encabezado con la identidad del producto.
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: {xs: 2, sm: 3},
        py: 1.75,
        backgroundColor: posPalette.surfaceAlt,
        borderBottom: RULE,
    },

    titleAvatar: {
        width: 52,
        height: 52,
        flexShrink: 0,
        borderRadius: 2,
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#ffffff',
    },

    titleText: {
        display: 'block',
        fontSize: '1.2rem',
        fontWeight: 700,
        lineHeight: 1.25,
        color: posPalette.ink,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    titleMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        mt: 0.25,
        fontSize: '0.875rem',
        fontWeight: 500,
        color: posPalette.muted,
    },

    content: {
        px: {xs: 2, sm: 3},
        pb: {xs: 2, sm: 2.5},
        '.MuiDialogTitle-root + &': {pt: {xs: 2, sm: 2.5}},
    },

    // Columna de captura: grupos en el orden del cálculo.
    groups: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    group: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    },

    groupLabel: {
        ...saleFormStyles.sectionLabel,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        // Regla fina que prolonga el rótulo hasta el borde de la columna.
        '&::after': {
            content: '""',
            flex: 1,
            borderTop: RULE,
        },
    },

    // "Lo que pagaste": costo y flete lado a lado cuando hay ancho.
    pairRow: {
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) minmax(0, 1.35fr)'},
        alignItems: 'start',
    },

    // Etiqueta siempre visible sobre el campo.
    fieldLabel: {
        display: 'block',
        mb: 0.5,
        fontSize: '0.95rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: posPalette.ink,
    },

    fieldRow: {
        display: 'flex',
        alignItems: 'stretch',
        gap: 1,
    },

    // Campo para dedo: 56px de alto, cifra grande y tabular.
    input: {
        flex: '1 1 auto',
        minWidth: 0,
        '& .MuiOutlinedInput-root': {
            height: 56,
            borderRadius: 2,
            backgroundColor: posPalette.surface,
        },
        '& .MuiInputBase-input': {
            ...TABULAR,
            minWidth: 0,
            fontSize: '1.4rem',
            fontWeight: 700,
            color: posPalette.ink,
        },
        '& .MuiInputAdornment-root .MuiTypography-root': {
            fontSize: '1.05rem',
            fontWeight: 700,
            color: posPalette.muted,
        },
    },

    helper: (isError) => ({
        mt: 0.5,
        minHeight: 18,
        fontSize: '0.8rem',
        lineHeight: 1.35,
        fontWeight: isError ? 600 : 400,
        color: isError ? 'error.main' : posPalette.muted,
    }),

    // "Tomar peso": acción secundaria, junto al campo de kilos.
    takeWeightButton: {
        flexShrink: 0,
        minHeight: 56,
        px: 2,
        borderRadius: 2,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        transition: 'transform .12s ease, background-color .12s ease',
        '&:active': {transform: 'scale(0.97)'},
    },

    scaleStatus: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1,
        mt: 0.75,
    },

    scaleChip: {
        ...TABULAR,
        height: 32,
        fontWeight: 600,
    },

    // "Báscula desconectada": discreto, pero se toca para reconectar (área táctil de 44px).
    reconnectChip: {
        height: 44,
        borderRadius: 2,
        fontWeight: 600,
    },

    // Columna de resultado: una "nota" con el precio arriba y el desglose debajo.
    result: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: RULE,
        borderRadius: 2.5,
        backgroundColor: posPalette.surfaceAlt,
        overflow: 'hidden',
    },

    suggested: {
        px: 2.5,
        pt: 2.5,
        pb: 2,
        textAlign: 'center',
        backgroundColor: posPalette.surface,
        borderBottom: RULE,
    },

    suggestedLabel: {
        ...saleFormStyles.sectionLabel,
        fontSize: '0.8rem',
    },

    // Lo más grande del diálogo: se lee de pie, a un brazo del monitor.
    suggestedValue: (valid) => ({
        ...TABULAR,
        mt: 0.5,
        fontSize: {xs: '3.5rem', md: '4.5rem'},
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color: valid ? posPalette.green : posPalette.rule,
    }),

    suggestedUnit: {
        mt: 0.5,
        fontSize: '0.95rem',
        fontWeight: 600,
        color: posPalette.muted,
    },

    // Comparación con el precio actual: neutra; ámbar solo como aviso cuando baja.
    comparison: (warn) => ({
        ...TABULAR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 2,
        py: 1.25,
        fontSize: '1.05rem',
        fontWeight: 700,
        color: warn ? posPalette.amberDark : posPalette.ink,
        backgroundColor: warn ? posPalette.amberTint : 'transparent',
        borderBottom: RULE,
    }),

    breakdown: {
        m: 0,
        px: 2.5,
        py: 0.5,
    },

    breakdownRow: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 2,
        py: 1.25,
        '& + &': {borderTop: RULE},
    },

    breakdownLabel: {
        m: 0,
        fontSize: '0.95rem',
        color: posPalette.muted,
    },

    breakdownNote: {
        display: 'block',
        fontSize: '0.8rem',
    },

    breakdownValue: {
        ...TABULAR,
        m: 0,
        flexShrink: 0,
        fontSize: '1.1rem',
        fontWeight: 700,
        color: posPalette.ink,
    },

    actions: {
        px: {xs: 2, sm: 3},
        py: 1.75,
        gap: 1.5,
        borderTop: RULE,
    },

    cancelButton: {
        minHeight: 52,
        px: {xs: 1.5, sm: 2.5},
        fontSize: '1rem',
        fontWeight: 600,
        color: posPalette.muted,
    },

    submitButton: {
        minHeight: 52,
        px: {xs: 2, sm: 3.5},
        borderRadius: 2,
        whiteSpace: 'nowrap',
        fontSize: {xs: '1rem', sm: '1.1rem'},
        fontWeight: 700,
        boxShadow: 'none',
        transition: 'transform .12s ease, background-color .12s ease',
        '&:hover': {boxShadow: 'none'},
        '&:active': {transform: 'scale(0.97)'},
    },
};
