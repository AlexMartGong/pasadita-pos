// Estilos del diálogo "Cobrar venta" (PaymentModal).
// Mismo lenguaje que el POS: superficies neutras, reglas finas, cifras tabulares, sin degradados.
// El único bloque verde saturado es "Guardar Venta / Actualizar"; billetes y teclas son neutros y
// "Exacto" solo lleva borde y tinte verdes.

import {posPalette, pressFeedback} from './SaleFormStyles';

const RULE = `1px solid ${posPalette.rule}`;
const TABULAR = {fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'};

// posPalette no tiene rojo: tinte suave solo para "Faltan $X".
const RED = '#c62828';
const RED_TINT = '#fdecea';

const hoverGreen = {
    '@media (hover: hover)': {
        '&:hover': {borderColor: posPalette.green, backgroundColor: posPalette.greenTint},
    },
};

const keyBase = {
    ...pressFeedback,
    ...TABULAR,
    minWidth: 0,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: 'none',
    boxShadow: 'none',
    color: posPalette.ink,
    borderColor: posPalette.rule,
    ...hoverGreen,
};

const denominationKey = {
    ...keyBase,
    minHeight: 60,
    fontSize: '1.2rem',
    backgroundColor: posPalette.surface,
};

const numpadKey = {
    ...keyBase,
    minHeight: {xs: 60, md: 68},
    fontSize: '1.6rem',
    backgroundColor: posPalette.surfaceAlt,
};

export const paymentModalStyles = {
    paper: {
        borderRadius: {xs: 0, sm: 3},
    },

    // Encabezado neutro (como "Calcular precio"): el verde saturado queda para "Guardar Venta".
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: {xs: 2, sm: 3},
        py: 1.75,
        backgroundColor: posPalette.surfaceAlt,
        borderBottom: RULE,
        color: posPalette.ink,
        fontSize: '1.2rem',
        fontWeight: 700,
    },

    titleIcon: {
        color: posPalette.green,
    },

    methodChip: {
        ml: 'auto',
        fontWeight: 600,
        color: posPalette.ink,
        borderColor: posPalette.rule,
        backgroundColor: posPalette.surface,
    },

    // Un solo grid: el orden del DOM es el de móvil (recibo → teclado → factura); en md+ el teclado
    // ocupa la columna derecha, junto a "Guardar Venta".
    cashLayout: {
        display: 'grid',
        gap: {xs: 2, md: 3},
        gridTemplateColumns: {xs: '1fr', md: '5fr 7fr'},
        gridTemplateRows: {md: 'auto 1fr'},
        gridTemplateAreas: {
            xs: '"summary" "keys" "invoice"',
            md: '"summary keys" "invoice keys"',
        },
    },

    summaryArea: {
        gridArea: 'summary',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
    },

    keysArea: {
        gridArea: 'keys',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    invoiceArea: {
        gridArea: 'invoice',
        pt: 2,
        borderTop: RULE,
    },

    // ── Recibo ──────────────────────────────────────────────────────────────

    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 2,
    },

    totalValue: {
        ...TABULAR,
        fontSize: '1.75rem',
        fontWeight: 700,
        color: posPalette.ink,
    },

    // Monto en captura: se ve como un campo enfocado (borde verde).
    tenderedBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 2,
        borderRadius: 2,
        border: `2px solid ${posPalette.green}`,
        backgroundColor: posPalette.surface,
    },

    // Prellenado sin editar: resaltado como texto seleccionado, porque el primer toque lo reemplaza.
    tenderedValue: (pristine) => ({
        ...TABULAR,
        alignSelf: 'flex-end',
        px: 0.75,
        borderRadius: 1,
        fontSize: {xs: '2.25rem', md: '2.75rem'},
        fontWeight: 700,
        lineHeight: 1.15,
        color: posPalette.ink,
        backgroundColor: pristine ? posPalette.greenTint : 'transparent',
        transition: 'background-color .12s ease',
    }),

    changeBox: (isValid) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 2,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        backgroundColor: isValid ? posPalette.greenTint : RED_TINT,
        color: isValid ? posPalette.greenDark : RED,
    }),

    changeLabel: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'inherit',
    },

    changeValue: {
        ...TABULAR,
        fontSize: '1.75rem',
        fontWeight: 700,
        color: 'inherit',
    },

    // ── Billetes + Exacto ───────────────────────────────────────────────────

    keyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
    },

    denominationKey,

    exactKey: {
        ...denominationKey,
        color: posPalette.greenDark,
        borderColor: posPalette.green,
        backgroundColor: posPalette.greenTint,
    },

    // ── Numpad ──────────────────────────────────────────────────────────────

    numpadKey,

    numpadAuxKey: {
        ...numpadKey,
        fontSize: '1rem',
        fontWeight: 600,
        color: posPalette.muted,
    },

    // ── Pago sin efectivo ───────────────────────────────────────────────────

    nonCashLayout: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    totalOnly: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        py: 3,
        borderRadius: 2,
        border: RULE,
        backgroundColor: posPalette.surfaceAlt,
    },

    methodLine: {
        fontSize: '1rem',
        fontWeight: 500,
        color: posPalette.muted,
    },

    totalOnlyValue: {
        ...TABULAR,
        fontSize: {xs: '2.75rem', sm: '3.25rem'},
        fontWeight: 700,
        lineHeight: 1.1,
        color: posPalette.ink,
    },

    nonCashInvoice: {
        pt: 2,
        borderTop: RULE,
    },
};
