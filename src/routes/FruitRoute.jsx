import {Navigate, Route, Routes} from "react-router-dom";
import {Dashboard} from "../components/Dashboard.jsx";

export const FruitRoute = () => {
    return (
        <>
            <Routes>
                <Route path={"dashboard"} element={<Dashboard/>}/>
                <Route path="/" element={<Navigate to="/dashboard"/>}/>
            </Routes>
        </>
    );
}
