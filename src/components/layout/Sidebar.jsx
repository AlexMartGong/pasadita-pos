import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../../auth/hooks/useAuth.js';
import {useState} from 'react';
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
    Paper,
    IconButton,
    AppBar,
    Toolbar,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Dashboard,
    Inventory,
    People,
    Person,
    Logout,
    Category,
    PointOfSale,
    ReceiptLong,
    Menu as MenuIcon
} from '@mui/icons-material';
import {sidebarStyles} from '../../styles/js/SidebarStyles.js';

export const Sidebar = () => {
    const location = useLocation();
    const {user, hasLimitedAccess, handlerLogout} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuItemClick = () => {
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            'bi-speedometer2': <Dashboard/>,
            'bi-box-seam': <Inventory/>,
            'bi bi-people': <People/>,
            'bi-people': <People/>,
            'bi-category': <Category/>,
            'bi-receipt': <ReceiptLong/>,
            'bi-truck': <PointOfSale/>,
            'bi-cart-plus': <PointOfSale/>
        };
        return icons[iconName] || <Dashboard/>;
    };

    const limitedMenuItems = [
        {path: '/sale/register', icon: 'bi-cart-plus', label: 'Nueva Venta'},
        {path: '/delivery', icon: 'bi-truck', label: 'Entregas'},
        {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
    ];

    const fullMenuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {path: '/sale/register', icon: 'bi-cart-plus', label: 'Nueva Venta'},
        {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
        {path: '/delivery', icon: 'bi-truck', label: 'Entregas'},
        {path: '/products', icon: 'bi-box-seam', label: 'Productos'},
        {path: '/users', icon: 'bi bi-people', label: 'Usuarios'},
        {path: '/customers', icon: 'bi-people', label: 'Clientes'},
        {path: '/customer-types', icon: 'bi-category', label: 'Tipos de Clientes'},
    ];

    const menuItems = hasLimitedAccess ? limitedMenuItems : fullMenuItems;

    const drawerContent = (
        <>
            {/* Header */}
            <Box sx={sidebarStyles.header}>
                <Typography
                    variant="h5"
                    sx={sidebarStyles.title}
                >
                    La Pasadita
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
                                    onClick={handleMenuItemClick}
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
                                {hasLimitedAccess ? 'Usuario Limitado' : 'Administrador'}
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
        </>
    );

    return (
        <>
            {/* Mobile AppBar with hamburger menu */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: '#1a1a1a',
                        zIndex: theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="abrir menú"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 'bold'
                            }}
                        >
                            La Pasadita
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Mobile Drawer (temporary) */}
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={sidebarStyles.drawerMobile}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                /* Desktop Drawer (permanent) */
                <Drawer
                    variant="permanent"
                    sx={sidebarStyles.drawer}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};