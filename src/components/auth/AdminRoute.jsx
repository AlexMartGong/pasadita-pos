import {Navigate} from "react-router-dom";
import {useAuth} from "../../auth/hooks/useAuth.js";

export const AdminRoute = ({children}) => {
    const {isAuth, isAdmin} = useAuth();

    if (!isAuth) {
        return <Navigate to="/login" replace/>;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace/>;
    }

    return children;
};
