import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/pages/LoginPage.jsx";
import {FruitRoute} from "./routes/FruitRoute.jsx";

export const AppRoutes = () => {

    const {isAuth} = useSelector(state => state.auth);

    return (
        <Routes>
            {isAuth ? (
                <>
                    <Route path="/*" element={<FruitRoute/>}/>
                </>
            ) : (
                <>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/*" element={<Navigate to="/login"/>}/>
                </>
            )}
        </Routes>
    )

}
