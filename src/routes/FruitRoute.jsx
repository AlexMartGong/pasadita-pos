import {Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "../pages/DashboardPage.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {SidebarProvider} from "../context/SidebarContext.jsx";
import {ProductPage} from "../pages/ProductPage.jsx";
import {UserPage} from "../pages/UserPage.jsx";

export const FruitRoute = () => {
    return (
        <SidebarProvider>
            <Sidebar/>
            <Routes>
                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="products" element={<ProductPage/>}/>
                <Route path="users" element={<UserPage/>}/>
            </Routes>
        </SidebarProvider>
    );
}
