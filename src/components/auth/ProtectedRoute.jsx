import {Navigate} from "react-router-dom";
import {useAuth} from "../../auth/hooks/useAuth.js";

/**
 * Ruta protegida que solo requiere autenticación.
 * Permite acceso a cualquier usuario autenticado (ROLE_ADMIN, ROLE_CAJERO, ROLE_PEDIDOS).
 */
export const ProtectedRoute = ({children}) => {
    const {isAuth} = useAuth();

    if (!isAuth) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

