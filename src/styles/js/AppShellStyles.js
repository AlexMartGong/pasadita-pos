// Estilos del "shell" de la aplicación: contenedor raíz (Sidebar + área principal).
// Convención del proyecto: objetos sx planos exportados como constante nombrada.

// Margen entre el borde de la ventana y las vistas inmersivas (/sale/register, /sale/edit/:id,
// /products/quick-prices). SaleFormStyles y QuickPricesStyles usan este mismo valor para calcular
// el alto de sus paneles, así que el área principal y las vistas dependen de una sola constante.
export const POS_GUTTER_PX = 12;

const DEFAULT_MAIN = {
    p: {xs: 1, sm: 2, md: 3},
    pt: {xs: 7, sm: 7, md: 6},
    backgroundColor: '#f5f5f5',
};

// Rutas inmersivas (POS, Precios Rápidos): sin el aire del resto de las vistas para aprovechar todo el monitor.
// En xs/sm el `pt` libra el AppBar fijo del menú móvil.
const POS_MAIN = {
    p: `${POS_GUTTER_PX}px`,
    pt: {xs: 9, md: `${POS_GUTTER_PX}px`},
    backgroundColor: '#f4f6f4',
};

export const appShellStyles = {
    root: {
        display: 'flex',
    },

    // `minWidth: 0` en vez de un ancho fijo: el área principal ocupa lo que deje el Sidebar,
    // esté expandido (250px) o colapsado en riel (64px).
    main: (isImmersiveRoute) => ({
        flexGrow: 1,
        minWidth: 0,
        minHeight: '100vh',
        ...(isImmersiveRoute ? POS_MAIN : DEFAULT_MAIN),
    }),
};
