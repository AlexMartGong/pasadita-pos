import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {ProductPage} from "../pages/ProductPage.jsx";
import {UserPage} from "../pages/UserPage.jsx";
import {RegisterUserPage} from "../pages/RegisterUserPage.jsx";
import {AdminRoute} from "../components/auth/AdminRoute.jsx";
import {Box} from '@mui/material';
import {RegisterProductPage} from "../pages/RegisterProductPage.jsx";

export const FruitRoute = () => {
    return (
        <Box sx={{display: 'flex'}}>
            <Sidebar/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
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
                    <Route path="product/register" element={
                        <AdminRoute>
                            <RegisterProductPage/>
                        </AdminRoute>
                    }/>
                </Routes>
            </Box>
        </Box>
    );
}
