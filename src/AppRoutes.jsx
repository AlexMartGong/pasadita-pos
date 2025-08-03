import {useSelector} from "react-redux";
import {Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./auth/pages/LoginPage.jsx";
import {FruitRoute} from "./routes/FruitRoute.jsx";

export const AppRoutes = () => {

    const {isAuth, isLoginLoading} = useSelector(state => state.auth);

    if (isLoginLoading) {
        return (
            <div className="container mt-5">
                <div className="row-center">
                    <div className="col text-center">
                        <div className="spinner-border text-primary spinner-border-lg" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
