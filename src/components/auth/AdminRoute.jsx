import {Navigate} from "react-router-dom";
import {useAuth} from "../../auth/hooks/useAuth.js";

/**
 * Ruta protegida solo para administradores.
 * Redirige a usuarios con acceso limitado (ROLE_CAJERO, ROLE_PEDIDOS) a Nueva Venta.
 */
export const AdminRoute = ({children}) => {
    const {isAuth, hasLimitedAccess} = useAuth();

    if (!isAuth) {
        return <Navigate to="/login" replace/>;
    }

    // Si tiene acceso limitado, redirigir a Nueva Venta
    if (hasLimitedAccess) {
        return <Navigate to="/sale/register" replace/>;
    }

    return children;
};
