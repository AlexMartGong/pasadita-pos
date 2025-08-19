import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {ProductPage} from "../pages/ProductPage.jsx";
import {UserPage} from "../pages/UserPage.jsx";
import {RegisterUserPage} from "../pages/RegisterUserPage.jsx";
import {AdminRoute} from "../components/auth/AdminRoute.jsx";

export const FruitRoute = () => {
    return (
        <>
            <Sidebar/>
            <main style={{marginLeft: '250px', padding: '20px'}}>
                <Routes>
                    <Route path="dashboard" element={<DashboardPage/>}/>
                    <Route path="users" element={
                        <AdminRoute>
                            <UserPage/>
                        </AdminRoute>
                    }/>
                    <Route path="users/register" element={
                        <AdminRoute>
                            <RegisterUserPage/>
                        </AdminRoute>
                    }/>
                    <Route path="users/edit/:id" element={
                        <AdminRoute>
                            <RegisterUserPage/>
                        </AdminRoute>
                    }/>
                    <Route path="users/edit-password/:id" element={
                        <AdminRoute>
                            <RegisterUserPage/>
                        </AdminRoute>
                    }/>
                    <Route path="products" element={
                        <AdminRoute>
                            <ProductPage/>
                        </AdminRoute>
                    }/>
                </Routes>
            </main>
        </>
    );
}
