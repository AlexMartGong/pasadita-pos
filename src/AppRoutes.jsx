import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/pages/LoginPage.jsx";
import {FruitRoute} from "./routes/FruitRoute.jsx";
import {PwaUpdatePrompt} from "./components/common/PwaUpdatePrompt.jsx";
import {SessionRestoreScreen} from "./components/auth/SessionRestoreScreen.jsx";

export const AppRoutes = () => {

    const {isAuth, isRestoring} = useSelector(state => state.auth);

    // Mientras la cookie decide si hay sesión no se evalúan rutas ni guards: nada redirige a /login y la URL se conserva.
    return (
        <>
            {isRestoring ? <SessionRestoreScreen/> : (
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
            )}
            <PwaUpdatePrompt/>
        </>
    )

}
