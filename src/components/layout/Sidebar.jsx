import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../../auth/hooks/useAuth.js';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Avatar,
    Divider,
    Button,
    Paper
} from '@mui/material';
import {
    Dashboard,
    Inventory,
    People,
    Person,
    Logout,
    Category,
    PointOfSale,
    ReceiptLong
} from '@mui/icons-material';
import {sidebarStyles} from '../../styles/js/SidebarStyles.js';

export const Sidebar = () => {
    const location = useLocation();
    const {user, hasLimitedAccess, handlerLogout} = useAuth();

    const getIcon = (iconName) => {
        const icons = {
            'bi-speedometer2': <Dashboard/>,
            'bi-box-seam': <Inventory/>,
            'bi bi-people': <People/>,
            'bi-people': <People/>,
            'bi-category': <Category/>,
            // 'bi-gear': <Settings/>,
            'bi-receipt': <ReceiptLong/>,
            'bi-truck': <PointOfSale/>,
            'bi-cart-plus': <PointOfSale/>
        };
        return icons[iconName] || <Dashboard/>;
    };

    // Menú para usuarios con acceso limitado (ROLE_CAJERO, ROLE_PEDIDOS)
    const limitedMenuItems = [
        {path: '/sale/register', icon: 'bi-cart-plus', label: 'Nueva Venta'},
        {path: '/delivery', icon: 'bi-truck', label: 'Entregas'},
        {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
    ];

    // Menú completo para admin
    const fullMenuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {path: '/sale/register', icon: 'bi-cart-plus', label: 'Nueva Venta'},
        {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
        {path: '/delivery', icon: 'bi-truck', label: 'Entregas'},
        {path: '/products', icon: 'bi-box-seam', label: 'Productos'},
        {path: '/users', icon: 'bi bi-people', label: 'Usuarios'},
        {path: '/customers', icon: 'bi-people', label: 'Clientes'},
        {path: '/customer-types', icon: 'bi-category', label: 'Tipos de Clientes'},
        // {path: '/settings', icon: 'bi-gear', label: 'Settings'}
    ];

    // Seleccionar menú según el tipo de acceso
    const menuItems = hasLimitedAccess ? limitedMenuItems : fullMenuItems;

    return (
        <Drawer
            variant="permanent"
            sx={sidebarStyles.drawer}
        >
            {/* Header */}
            <Box sx={sidebarStyles.header}>
                <Typography
                    variant="h5"
                    sx={sidebarStyles.title}
                >
                    FruitApp
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={sidebarStyles.navigationContainer}>
                <List>
                    {menuItems.map((item, index) => {
                        const isSelected = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding sx={sidebarStyles.listItem}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={isSelected}
                                    sx={sidebarStyles.listItemButton(index, isSelected)}
                                >
                                    <ListItemIcon sx={sidebarStyles.listItemIcon(isSelected)}>
                                        {getIcon(item.icon)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={sidebarStyles.listItemText(isSelected)}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* User Profile & Logout */}
            <Box sx={sidebarStyles.profileContainer}>
                <Divider sx={sidebarStyles.divider}/>
                <Paper elevation={0} sx={sidebarStyles.profilePaper}>
                    <Box sx={sidebarStyles.profileBox}>
                        <Avatar sx={sidebarStyles.avatar}>
                            <Person/>
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={sidebarStyles.userName}>
                                {user || 'Admin User'}
                            </Typography>
                            <Typography variant="caption" sx={sidebarStyles.userRole}>
                                Administrator
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        onClick={handlerLogout}
                        startIcon={<Logout/>}
                        sx={sidebarStyles.logoutButton}
                    >
                        Logout
                    </Button>
                </Paper>
            </Box>
        </Drawer>
    );
};