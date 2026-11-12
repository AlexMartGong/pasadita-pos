// Estilos de la vista "Precios Rápidos" (edición táctil de precios).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.
//
// Comparte el lenguaje visual de la vista POS: la barra, el grid con scroll y el pie salen de
// saleFormStyles; aquí solo vive lo propio de la vista (contenedor y tarjeta de precio).

import {POS_GUTTER_PX} from './AppShellStyles';
import {posPalette, saleFormStyles} from './SaleFormStyles';

// El área principal aporta POS_GUTTER_PX arriba y abajo.
const VERTICAL_OFFSET = POS_GUTTER_PX * 2;

// Alto fijo de todo lo que no es la foto en una pantalla de 4 filas: gutter, barra superior,
// pie, márgenes del grid y el cuerpo de las 4 tarjetas. Lo que sobra de la ventana se reparte
// entre las 4 fotos, así la cuadrícula de 6x4 entra completa en 1080p.
const FOUR_ROWS_CHROME_PX = 684;

const RULE = `1px solid ${posPalette.rule}`;
const SAVED_RING = '0 0 0 3px rgba(46, 125, 50, 0.18)';

export const quickPricesStyles = {
    // Contenedor de la vista: todo el ancho disponible; en md+ ocupa exactamente la ventana
    // (el scroll vive dentro del panel).
    page: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: {xs: 'auto', md: `calc(100vh - ${VERTICAL_OFFSET}px)`},
        '@supports (height: 100dvh)': {
            height: {xs: 'auto', md: `calc(100dvh - ${VERTICAL_OFFSET}px)`},
        },
    },

    // Filtros de categoría: en xs/sm una sola fila deslizable con el dedo (sin barra de scroll);
    // desde md se acomodan en renglones como en el catálogo de ventas.
    categoryChips: {
        ...saleFormStyles.categoryChips,
        minWidth: 0,
        maxWidth: '100%',
        flexWrap: {xs: 'nowrap', md: 'wrap'},
        overflowX: {xs: 'auto', md: 'visible'},
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {display: 'none'},
        '& .MuiChip-root': {flexShrink: 0},
    },

    // Tarjeta de producto: plana, borde fino. Verde = precio modificado sin guardar; con el
    // guardado confirmado suma un aro suave durante 1.5s.
    card: ({changed, saved}) => ({
        height: '100%',
        display: 'flex',
        // Celular: foto a la izquierda y contenido a la derecha, para que el precio tenga ancho.
        flexDirection: {xs: 'row', sm: 'column'},
        overflow: 'hidden',
        borderRadius: 2.5,
        border: RULE,
        borderColor: changed || saved ? posPalette.green : posPalette.rule,
        boxShadow: saved ? SAVED_RING : 'none',
        backgroundColor: posPalette.surface,
        transition: 'border-color .15s ease, box-shadow .2s ease',
    }),

    // Foto del producto (o iniciales sobre el color de la categoría si no hay imagen).
    avatar: {
        width: {xs: 76, sm: '100%'},
        flexShrink: 0,
        alignSelf: 'stretch',
        height: {xs: 'auto', sm: 104},
        minHeight: {xs: 88, sm: 0},
        fontSize: {xs: '1.6rem', sm: '2.3rem'},
        fontWeight: 700,
        color: '#ffffff',
        '@media (min-width: 1536px)': {
            height: 100,
            '@supports (height: 100dvh)': {
                height: `clamp(72px, calc((100dvh - ${FOUR_ROWS_CHROME_PX}px) / 4), 108px)`,
            },
        },
    },

    cardContent: {
        flex: '1 1 0',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        '&:last-child': {pb: 1},
    },

    name: {
        fontWeight: 600,
        lineHeight: 1.3,
        color: posPalette.ink,
    },

    // Categoría y unidad a la izquierda, ID a la derecha. El extremo derecho queda libre para sumar
    // acciones (p. ej. una calculadora) sin reacomodar la tarjeta.
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        mt: 0.25,
        minHeight: 18,
        fontSize: '0.75rem',
        lineHeight: 1.4,
        color: posPalette.muted,
    },

    metaCategory: {
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },

    metaId: {
        flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
    },

    // Fila de edición de precio: input + botón guardar, pegada al fondo de la tarjeta.
    priceRow: {
        display: 'flex',
        alignItems: 'stretch',
        gap: 0.75,
        mt: 'auto',
        pt: 1,
    },

    // Input de captura rápida: 48px de alto, cifra grande y tabular. Dentro solo van el "$" y los
    // dígitos (la unidad vive en la fila de metadatos) para que el precio nunca se recorte.
    // Contorno verde mientras el precio difiere del guardado.
    priceInput: (changed) => ({
        flex: '1 1 auto',
        minWidth: 0,
        '& .MuiOutlinedInput-root': {
            height: 48,
            px: 1,
            borderRadius: 2,
            backgroundColor: changed ? posPalette.greenTint : posPalette.surface,
            transition: 'background-color .15s ease',
        },
        ...(changed && {
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: posPalette.green,
                borderWidth: 2,
            },
        }),
        '& .MuiInputBase-input': {
            px: 0,
            py: 0.75,
            minWidth: 0,
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: posPalette.ink,
            // Sin flechas: en táctil estorban y roban ancho a la cifra.
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
            },
        },
    }),

    // "$": acompaña a la cifra sin competir con ella.
    currencyAdornment: {
        ml: 0,
        mr: 0.5,
        '& .MuiTypography-root': {
            fontSize: '1rem',
            fontWeight: 700,
            color: posPalette.muted,
        },
    },

    // Botón guardar: área táctil de 48x48px. Confirmado = palomita sobre verde aunque el botón
    // ya esté deshabilitado (no queda nada por guardar).
    saveButton: (saved) => ({
        flexShrink: 0,
        minWidth: 48,
        minHeight: 48,
        p: 0,
        borderRadius: 2,
        boxShadow: 'none',
        transition: 'transform .12s ease, background-color .12s ease',
        '&:hover': {boxShadow: 'none'},
        '&:active': {transform: 'scale(0.94)'},
        ...(saved && {
            '&.Mui-disabled': {
                backgroundColor: posPalette.green,
                color: '#ffffff',
            },
        }),
    }),
};
