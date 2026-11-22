import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {onInitLogin, onLogout} from "../../stores/slices/auth/authSlice.js";
import {loginValidation} from "../services/authService.js";
import {endSession, revokeSession, saveSession} from "../services/sessionService.js";

export const useAuth = () => {
    const {isAuth, user, isAdmin, isLoginLoading, role, employeeId} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlerLogin = async ({username, password}) => {
        dispatch(onInitLogin());

        try {
            const response = await loginValidation({username, password});
            const login = saveSession(response.data);

            toast.success(`¡Bienvenido ${login.user}!`);

            // Redirigir según el rol
            const isCajeroRole = login.role.includes("ROLE_CAJERO");
            const isPedidosRole = login.role.includes("ROLE_PEDIDOS");

            if ((isCajeroRole || isPedidosRole) && !login.isAdmin) {
                navigate("/sale/register");
            } else {
                navigate("/products/quick-prices");
            }

        } catch (error) {
            console.error("Error in handlerLogin:", error);
            if (error.response?.status === 401)
                toast.error("Usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
            if (error.response?.status === 403) toast.error("No tienes permisos para acceder");
            if (error.response?.status >= 500) toast.error("Error del servidor. Intenta más tarde");
            dispatch(onLogout());
        }
    };

    // Revoca la cookie en el backend antes de limpiar; si falla (sin red) se limpia igual y el próximo arranque
    // reintenta la revocación en vez de restaurar la sesión.
    const handlerLogout = async (message = "Has cerrado sesión correctamente") => {
        await revokeSession();
        endSession();
        toast.info(message);
        navigate("/login");
    };

    // Verificar roles específicos
    const isCajero = role?.includes("ROLE_CAJERO") || false;
    const isPedidos = role?.includes("ROLE_PEDIDOS") || false;

    // Solo cajero y pedidos tienen acceso limitado a Nueva Venta
    const hasLimitedAccess = (isCajero || isPedidos) && !isAdmin;

    return {
        isAuth,
        user,
        isAdmin,
        isCajero,
        isPedidos,
        hasLimitedAccess,
        role,
        employeeId,
        isLoginLoading,
        handlerLogin,
        handlerLogout
    };
};
