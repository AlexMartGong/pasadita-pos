import {useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';

// Rutas de la vista POS (venta nueva y edición comparten SaleForm).
const POS_ROUTE_PATTERN = /^\/sale\/(register|edit\/[^/]+)\/?$/;

/**
 * Estado de colapso del Sidebar de escritorio.
 * Al entrar a la vista POS se colapsa solo para ceder ancho al catálogo y al ticket; al salir se
 * vuelve a expandir. Entre un cambio y otro manda el toggle manual del usuario.
 */
export const useSidebarCollapse = () => {
    const {pathname} = useLocation();
    const isPosRoute = POS_ROUTE_PATTERN.test(pathname);

    const [collapsed, setCollapsed] = useState(isPosRoute);
    const [wasPosRoute, setWasPosRoute] = useState(isPosRoute);

    // Ajuste de estado durante el render (sin efecto): solo al cruzar el límite POS / no POS.
    if (wasPosRoute !== isPosRoute) {
        setWasPosRoute(isPosRoute);
        setCollapsed(isPosRoute);
    }

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    return {isPosRoute, collapsed, toggleCollapsed};
};
