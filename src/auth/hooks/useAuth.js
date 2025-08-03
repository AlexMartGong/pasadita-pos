import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {onInitLogin, onLogin, onLogout} from "../../stores/slices/auth/authSlice.js";
import {loginValidation} from "../services/authService.js";

export const useAuth = () => {
    const {isAuth, user, isAdmin, isLoginLoading} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlerLogin = async ({username, password}) => {
        dispatch(onInitLogin());

        try {
            const response = await loginValidation({username, password});
            const token = response.data.token;
            const isAdmin = response.data.authorities?.some(auth => auth.authority === "ROLE_ADMIN") || false;

            if (response.theError) {
                toast.error("Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.");
                dispatch(onLogout());
                return;
            }

            const login = {
                isAuth: true,
                isAdmin: isAdmin,
                user: response.data.username
            };

            dispatch(onLogin(login));
            sessionStorage.setItem("login", JSON.stringify(login));
            sessionStorage.setItem("token", `Bearer ${token}`);

            toast.success(`¡Bienvenido ${response.data.username}!`);
            navigate("/");

        } catch (error) {
            toast.error("Error de conexión. Inténtalo de nuevo.");
            dispatch(onLogout());
            console.error("Error in handlerLogin:", error);
        }
    };

    const handlerLogout = () => {
        dispatch(onLogout());
        sessionStorage.removeItem("login");
        toast.info("Has cerrado sesión correctamente");
        navigate("/login");
    };

    return {
        isAuth,
        user,
        isAdmin,
        isLoginLoading,
        handlerLogin,
        handlerLogout
    };
};
