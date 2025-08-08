import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {onInitLogin, onLogin, onLogout} from "../../stores/slices/auth/authSlice.js";
import {loginValidation} from "../services/authService.js";

export const useAuth = () => {
    const {isAuth, user, isAdmin, isLoginLoading, role} = useSelector(state => state.auth);
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
                user: response.data.username
            };

            dispatch(onLogin(login));
            sessionStorage.setItem("login", JSON.stringify(login));
            sessionStorage.setItem("token", `Bearer ${token}`);

            toast.success(`¡Bienvenido ${response.data.username}!`);
            navigate("/dashboard");

        } catch (error) {
            console.error("Error in handlerLogin:", error);

            if (error.response?.status === 401) {
                toast.error("Usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
            } else {
                toast.error("Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.");
            }

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

    return {
        isAuth,
        user,
        isAdmin,
        role,
        isLoginLoading,
        handlerLogin,
        handlerLogout
    };
};
