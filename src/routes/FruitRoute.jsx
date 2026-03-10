import {Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {ProductPage} from "../pages/product/ProductPage.jsx";
import {UserPage} from "../pages/user/UserPage.jsx";
import {RegisterUserPage} from "../pages/user/RegisterUserPage.jsx";
import {AdminRoute} from "../components/auth/AdminRoute.jsx";
import {ProtectedRoute} from "../components/auth/ProtectedRoute.jsx";
import {Box, useMediaQuery, useTheme} from '@mui/material';
import {RegisterProductPage} from "../pages/product/RegisterProductPage.jsx";
import {SimpleProductTable} from "../components/product/SimpleProductTable.jsx";
import {CustomerPage} from "../pages/customer/CustomerPage.jsx";
import {RegisterCustomerPage} from "../pages/customer/RegisterCustomerPage.jsx";
import {CustomerTypePage} from "../pages/customer/CustomerTypePage.jsx";
import {RegisterCustomerTypePage} from "../pages/customer/RegisterCustomerTypePage.jsx";
import {SalePage} from "../pages/sale/SalePage.jsx";
import {RegisterSalePage} from "../pages/sale/RegisterSalePage.jsx";
import {DeliveryPage} from "../pages/delivery/deliveryPage.jsx";
import {TicketPage} from "../pages/sale/TicketPage.jsx";

export const FruitRoute = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{display: 'flex'}}>
            <Sidebar/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2, md: 3 },
                    pt: isMobile ? 8 : 3, // Extra top padding on mobile for AppBar
                    ml: { xs: 0, md: '250px' }, // Margin for sidebar on desktop
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                    width: { xs: '100%', md: 'calc(100% - 250px)' }
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
                        <ProtectedRoute>
                            <SalePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="sale/register" element={
                        <ProtectedRoute>
                            <RegisterSalePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="sale/edit/:id" element={
                        <AdminRoute>
                            <RegisterSalePage/>
                        </AdminRoute>
                    }/>
                    <Route path={"delivery"} element={
                        <ProtectedRoute>
                            <DeliveryPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path={"sale/ticket/:id"} element={
                        <ProtectedRoute>
                            <TicketPage/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </Box>
        </Box>
    );
}
