import {useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';

// Rutas "inmersivas": vistas táctiles que usan todo el ancho del monitor.
// POS (venta nueva y edición comparten SaleForm) y Precios Rápidos.
const IMMERSIVE_ROUTE_PATTERNS = [
    /^\/sale\/(register|edit\/[^/]+)\/?$/,
    /^\/products\/quick-prices\/?$/,
];

/**
 * Estado de colapso del Sidebar de escritorio.
 * Al entrar a una vista inmersiva se colapsa solo para cederle ancho; al salir se vuelve a
 * expandir. Entre un cambio y otro manda el toggle manual del usuario.
 */
export const useSidebarCollapse = () => {
    const {pathname} = useLocation();
    const isImmersiveRoute = IMMERSIVE_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));

    const [collapsed, setCollapsed] = useState(isImmersiveRoute);
    const [wasImmersiveRoute, setWasImmersiveRoute] = useState(isImmersiveRoute);

    // Ajuste de estado durante el render (sin efecto): solo al cruzar el límite inmersiva / normal.
    if (wasImmersiveRoute !== isImmersiveRoute) {
        setWasImmersiveRoute(isImmersiveRoute);
        setCollapsed(isImmersiveRoute);
    }

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    return {isImmersiveRoute, collapsed, toggleCollapsed};
};
