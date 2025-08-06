import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {ProductPage} from "../pages/ProductPage.jsx";
import {UserPage} from "../pages/UserPage.jsx";
import {RegisterUserPage} from "../pages/RegisterUserPage.jsx";

export const FruitRoute = () => {
    return (
        <>
            <Sidebar/>
            <main style={{marginLeft: '250px', padding: '20px'}}>
                <Routes>
                    <Route path="dashboard" element={<DashboardPage/>}/>
                    <Route path="products" element={<ProductPage/>}/>
                    <Route path="users" element={<UserPage/>}/>
                    <Route path="users/register" element={<RegisterUserPage/>}/>
                    <Route path="users/edit/:id" element={<RegisterUserPage/>}/>
                </Routes>
            </main>
        </>
    );
}
