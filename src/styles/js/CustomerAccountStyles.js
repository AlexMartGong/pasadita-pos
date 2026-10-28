// Abonos y crédito: estética de "libreta de cuentas" dentro del estilo de la casa. Cifras tabulares para que
// los montos se alineen, verde = pagado, ámbar = saldo, rojo = límite rebasado o cancelación.

export const accountPalette = {
    ink: '#1f2a24',
    muted: '#5f6b64',
    paid: '#2e7d32',
    balance: '#b26a00',
    danger: '#c62828',
    rule: 'rgba(31, 42, 36, 0.12)',
    paper: '#fbfbf8',
};

const DIALOG_GRADIENTS = {
    default: 'linear-gradient(135deg, #00695c 0%, #26a69a 100%)',
    danger: 'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)',
};

export const customerAccountStyles = {
    amount: {
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
        whiteSpace: 'nowrap',
    },

    amountInput: {
        fontVariantNumeric: 'tabular-nums',
        fontSize: '1.35rem',
        fontWeight: 600,
    },

    dialogTitle: (tone = 'default') => ({
        background: DIALOG_GRADIENTS[tone] ?? DIALOG_GRADIENTS.default,
        color: 'white',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        pr: 7,
        position: 'relative',
    }),

    dialogTitleText: {
        display: 'block',
        lineHeight: 1.25,
    },

    dialogSubtitle: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 400,
        opacity: 0.9,
        mt: 0.25,
    },

    dialogClose: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'white',
    },

    // MUI anula el padding superior del contenido que sigue al título; se recupera con la misma especificidad.
    dialogContent: {
        '.MuiDialogTitle-root + &': {pt: 3},
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },

    dialogActions: {
        px: 3,
        pb: 2.5,
        pt: 1,
        gap: 1.5,
        flexWrap: 'wrap',
        '& > :not(style) ~ :not(style)': {ml: 0},
    },

    touchButton: {
        minHeight: 48,
        px: 3,
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
    },

    quickButton: {
        minHeight: 48,
        alignSelf: 'flex-start',
        textTransform: 'none',
        fontWeight: 600,
    },

    summaryBox: {
        p: 2,
        borderRadius: 2,
        backgroundColor: accountPalette.paper,
        border: `1px solid ${accountPalette.rule}`,
    },

    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 2,
        py: 0.75,
        '&:not(:last-of-type)': {borderBottom: `1px dashed ${accountPalette.rule}`},
    },

    summaryLabel: {
        color: accountPalette.muted,
        fontSize: '0.9rem',
    },

    sectionLabel: {
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: accountPalette.muted,
    },

    changeBox: {
        p: 2.5,
        borderRadius: 2,
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.08) 0%, rgba(102, 187, 106, 0.18) 100%)',
        border: '1px dashed rgba(46, 125, 50, 0.45)',
    },

    changeLabel: {
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: accountPalette.paid,
    },

    changeValue: {
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 800,
        color: accountPalette.paid,
        lineHeight: 1.1,
        mt: 0.5,
    },

    allocationList: {
        m: 0,
        p: 0,
        listStyle: 'none',
    },

    allocationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.75,
        borderBottom: `1px dashed ${accountPalette.rule}`,
        '&:last-of-type': {borderBottom: 'none'},
    },

    paymentRow: {
        display: 'flex',
        flexDirection: {xs: 'column', sm: 'row'},
        alignItems: {xs: 'stretch', sm: 'center'},
        gap: {xs: 1, sm: 2},
        py: 1.5,
        borderBottom: `1px solid ${accountPalette.rule}`,
        '&:last-of-type': {borderBottom: 'none'},
    },

    paymentMeta: {
        flex: 1,
        minWidth: 0,
    },

    paymentAmountBlock: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: {xs: 'space-between', sm: 'flex-end'},
        gap: 1,
        flexWrap: 'wrap',
    },

    cancelledAmount: {
        textDecoration: 'line-through',
        color: 'text.disabled',
    },

    paymentActions: {
        display: 'flex',
        gap: 0.5,
        '& .MuiIconButton-root': {width: 44, height: 44},
    },

    noteSummary: {
        display: 'grid',
        gridTemplateColumns: {xs: '1fr 1fr', md: '2fr repeat(3, 1fr)'},
        alignItems: 'center',
        gap: {xs: 1, md: 2},
        width: '100%',
        pr: 1,
    },

    noteFigure: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: {xs: 'flex-start', md: 'flex-end'},
    },

    balanceValue: {
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 700,
        color: accountPalette.balance,
        whiteSpace: 'nowrap',
    },

    timeline: {
        position: 'relative',
        pl: 3,
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 7,
            top: 6,
            bottom: 6,
            width: 2,
            backgroundColor: accountPalette.rule,
        },
    },

    timelineItem: {
        position: 'relative',
        pb: 2.5,
        '&:last-of-type': {pb: 0},
    },

    timelineDot: (color) => ({
        position: 'absolute',
        left: -24,
        top: 4,
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: color,
        border: '3px solid #fff',
        boxShadow: `0 0 0 1px ${accountPalette.rule}`,
    }),

    headerChips: {
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        mt: 1,
    },

    headerActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1.5,
        flexWrap: 'wrap',
        mt: 3,
    },

    emptyState: {
        py: 6,
        px: 2,
        textAlign: 'center',
        color: accountPalette.muted,
    },

    filtersBar: {
        display: 'grid',
        gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr', lg: 'repeat(5, 1fr)'},
        gap: 2,
        mb: 2,
    },
};
