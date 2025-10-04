import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {ProductPage} from "../pages/product/ProductPage.jsx";
import {UserPage} from "../pages/user/UserPage.jsx";
import {RegisterUserPage} from "../pages/user/RegisterUserPage.jsx";
import {AdminRoute} from "../components/auth/AdminRoute.jsx";
import {Box} from '@mui/material';
import {RegisterProductPage} from "../pages/product/RegisterProductPage.jsx";
import {SimpleProductTable} from "../components/product/SimpleProductTable.jsx";
import {CustomerPage} from "../pages/customer/CustomerPage.jsx";
import {RegisterCustomerPage} from "../pages/customer/RegisterCustomerPage.jsx";
import {CustomerTypePage} from "../pages/customer/CustomerTypePage.jsx";
import {RegisterCustomerTypePage} from "../pages/customer/RegisterCustomerTypePage.jsx";
import {SalePage} from "../pages/sale/SalePage.jsx";
import {RegisterSalePage} from "../pages/sale/RegisterSalePage.jsx";

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
                    <Route path="product/edit/:id" element={
                        <AdminRoute>
                            <RegisterProductPage/>
                        </AdminRoute>
                    }/>
                    <Route path="product/price-change" element={
                        <AdminRoute>
                            <SimpleProductTable/>
                        </AdminRoute>
                    }/>
                    <Route path="customers" element={
                        <AdminRoute>
                            <CustomerPage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer/register" element={
                        <AdminRoute>
                            <RegisterCustomerPage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer/edit/:id" element={
                        <AdminRoute>
                            <RegisterCustomerPage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer-types" element={
                        <AdminRoute>
                            <CustomerTypePage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer-type/register" element={
                        <AdminRoute>
                            <RegisterCustomerTypePage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer-type/edit/:id" element={
                        <AdminRoute>
                            <RegisterCustomerTypePage/>
                        </AdminRoute>
                    }/>
                    <Route path="sales" element={
                        <AdminRoute>
                            <SalePage/>
                        </AdminRoute>
                    }/>
                    <Route path="sale/register" element={
                        <AdminRoute>
                            <RegisterSalePage/>
                        </AdminRoute>
                    }/>
                    <Route path="sale/edit/:id" element={
                        <AdminRoute>
                            <RegisterSalePage/>
                        </AdminRoute>
                    }/>
                </Routes>
            </Box>
        </Box>
    );
}
