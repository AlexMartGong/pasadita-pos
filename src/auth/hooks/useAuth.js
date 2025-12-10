import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {onInitLogin, onLogin, onLogout} from "../../stores/slices/auth/authSlice.js";
import {loginValidation} from "../services/authService.js";

export const useAuth = () => {
    const {isAuth, user, isAdmin, isLoginLoading, role, employeeId} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlerLogin = async ({username, password}) => {
        dispatch(onInitLogin());

        try {
            const response = await loginValidation({username, password});
            const token = response.data.token;
            const isAdmin = response.data.authorities?.some(auth => auth.authority === "ROLE_ADMIN") || false;
            const role = response.data.authorities?.map(auth => auth.authority).join(", ") || "";

            const login = {
                isAuth: true,
                isAdmin: isAdmin,
                role: role,
                user: response.data.username,
                employeeId: response.data.id || response.data.employeeId || 0
            };

            dispatch(onLogin(login));
            sessionStorage.setItem("login", JSON.stringify(login));
            sessionStorage.setItem("token", `Bearer ${token}`);

            toast.success(`¡Bienvenido ${response.data.username}!`);

            // Redirigir según el rol
            const isCajeroRole = role.includes("ROLE_CAJERO");
            const isPedidosRole = role.includes("ROLE_PEDIDOS");

            if ((isCajeroRole || isPedidosRole) && !isAdmin) {
                navigate("/sale/register");
            } else {
                navigate("/dashboard");
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

    const handlerLogout = () => {
        dispatch(onLogout());
        sessionStorage.removeItem("login");
        sessionStorage.removeItem("token");
        sessionStorage.clear();
        toast.info("Has cerrado sesión correctamente");
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
