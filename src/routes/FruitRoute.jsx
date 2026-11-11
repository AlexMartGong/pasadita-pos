import {useEffect} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {getStationId} from "../services/agentService.js";
import {ProductPage} from "../pages/product/ProductPage.jsx";
import {UserPage} from "../pages/user/UserPage.jsx";
import {RegisterUserPage} from "../pages/user/RegisterUserPage.jsx";
import {AdminRoute} from "../components/auth/AdminRoute.jsx";
import {ProtectedRoute} from "../components/auth/ProtectedRoute.jsx";
import {Box} from '@mui/material';
import {RegisterProductPage} from "../pages/product/RegisterProductPage.jsx";
import {ProductPriceEditor} from "../components/product/ProductPriceEditor.jsx";
import {CustomerPage} from "../pages/customer/CustomerPage.jsx";
import {RegisterCustomerPage} from "../pages/customer/RegisterCustomerPage.jsx";
import {CustomerTypePage} from "../pages/customer/CustomerTypePage.jsx";
import {RegisterCustomerTypePage} from "../pages/customer/RegisterCustomerTypePage.jsx";
import {CustomerFiscalDataPage} from "../pages/customerFiscalData/CustomerFiscalDataPage.jsx";
import {CustomerFiscalDataRegisterPage} from "../pages/customerFiscalData/CustomerFiscalDataRegisterPage.jsx";
import {CustomerFiscalDataEditPage} from "../pages/customerFiscalData/CustomerFiscalDataEditPage.jsx";
import {SalePage} from "../pages/sale/SalePage.jsx";
import {RegisterSalePage} from "../pages/sale/RegisterSalePage.jsx";
import {DeliveryPage} from "../pages/delivery/deliveryPage.jsx";
import {TicketPage} from "../pages/sale/TicketPage.jsx";
import {InvoicePage} from "../pages/invoice/InvoicePage.jsx";
import {CustomerAccountPage} from "../pages/customerAccount/CustomerAccountPage.jsx";
import {CustomerDebtsPage} from "../pages/customerAccount/CustomerDebtsPage.jsx";
import {PaymentHistoryPage} from "../pages/customerAccount/PaymentHistoryPage.jsx";
import {useSidebarCollapse} from "../hooks/layout/useSidebarCollapse.js";
import {appShellStyles} from "../styles/js/AppShellStyles.js";

export const FruitRoute = () => {
    useEffect(() => {
        getStationId();
    }, []);

    // El Sidebar se colapsa solo en la vista POS; el área principal ajusta su aire a la misma ruta.
    const {isPosRoute, collapsed, toggleCollapsed} = useSidebarCollapse();

    return (
        <Box sx={appShellStyles.root}>
            <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed}/>
            <Box
                component="main"
                sx={appShellStyles.main(isPosRoute)}
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
                    <Route path="products/quick-prices" element={
                        <AdminRoute>
                            <ProductPriceEditor/>
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
                    <Route path="customer-fiscal-data" element={
                        <AdminRoute>
                            <CustomerFiscalDataPage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer-fiscal-data/register" element={
                        <AdminRoute>
                            <CustomerFiscalDataRegisterPage/>
                        </AdminRoute>
                    }/>
                    <Route path="customer-fiscal-data/edit/:id" element={
                        <AdminRoute>
                            <CustomerFiscalDataEditPage/>
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
                    {/* "Pendientes" se retiró: ahora es el filtro "Solo con saldo" de Pedidos. */}
                    <Route path={"pending"} element={<Navigate to="/delivery?filtro=saldo" replace/>}/>
                    <Route path={"sale/ticket/:id"} element={
                        <ProtectedRoute>
                            <TicketPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="invoices" element={
                        <ProtectedRoute>
                            <InvoicePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="customers/:customerId/account" element={
                        <ProtectedRoute>
                            <CustomerAccountPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="customers/debts" element={
                        <AdminRoute>
                            <CustomerDebtsPage/>
                        </AdminRoute>
                    }/>
                    <Route path="payments/history" element={
                        <AdminRoute>
                            <PaymentHistoryPage/>
                        </AdminRoute>
                    }/>
                </Routes>
            </Box>
        </Box>
    );
}
