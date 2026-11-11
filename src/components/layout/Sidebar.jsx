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
    Collapse,
    Typography,
    Box,
    Avatar,
    Divider,
    Button,
    Paper,
    IconButton,
    AppBar,
    Toolbar,
    Tooltip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Dashboard,
    Description,
    Inventory,
    People,
    Person,
    Logout,
    Category,
    LocalShipping,
    ManageAccounts,
    PointOfSale,
    ReceiptLong,
    Receipt,
    AccountBalanceWallet,
    History,
    PriceChange,
    ExpandLess,
    ExpandMore,
    Menu as MenuIcon,
    MenuOpen
} from '@mui/icons-material';
import {sidebarStyles} from '../../styles/js/SidebarStyles.js';

// `collapsed` / `onToggleCollapse` solo afectan al Drawer de escritorio (md+): colapsado se
// muestra como riel de iconos de 64px. El Drawer móvil siempre usa el menú completo.
export const Sidebar = ({collapsed = false, onToggleCollapse}) => {
    const location = useLocation();
    const {user, hasLimitedAccess, handlerLogout} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState({operaciones: true});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleToggleGroup = (groupId) => {
        setOpenGroups((prev) => ({...prev, [groupId]: !prev[groupId]}));
    };

    const handleMenuItemClick = () => {
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    // Cada destino tiene un icono propio: en el riel no hay etiqueta que los distinga.
    const getIcon = (iconName) => {
        const icons = {
            'bi-speedometer2': <Dashboard/>,
            'bi-box-seam': <Inventory/>,
            'bi bi-people': <ManageAccounts/>,
            'bi-people': <People/>,
            'bi-category': <Category/>,
            'bi-receipt': <ReceiptLong/>,
            'bi-truck': <LocalShipping/>,
            'bi-cart-plus': <PointOfSale/>,
            'bi-receipt-fiscal': <Receipt/>,
            'bi-invoice': <Description/>,
            'bi-price': <PriceChange/>,
            'bi-debts': <AccountBalanceWallet/>,
            'bi-payment-history': <History/>
        };
        return icons[iconName] || <Dashboard/>;
    };

    const limitedMenuItems = [
        {
            type: 'group',
            id: 'operaciones',
            label: 'Operaciones',
            icon: 'bi-cart-plus',
            items: [
                {path: '/sale/register', icon: 'bi-cart-plus', label: 'Nueva Venta'},
                {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
                {path: '/delivery', icon: 'bi-truck', label: 'Pedidos'},
            ]
        },
        {
            type: 'group',
            id: 'facturacion',
            label: 'Facturación',
            icon: 'bi-invoice',
            items: [
                {path: '/invoices', icon: 'bi-invoice', label: 'Facturas'},
            ]
        },
    ];

    const fullMenuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {
            type: 'group',
            id: 'operaciones',
            label: 'Operaciones',
            icon: 'bi-cart-plus',
            items: [
                {path: '/products/quick-prices', icon: 'bi-price', label: 'Precios Rápidos'},
                {path: '/sales', icon: 'bi-receipt', label: 'Ventas'},
                {path: '/delivery', icon: 'bi-truck', label: 'Pedidos'},
            ]
        },
        {
            type: 'group',
            id: 'cobranza',
            label: 'Cobranza',
            icon: 'bi-debts',
            items: [
                {path: '/customers/debts', icon: 'bi-debts', label: 'Clientes con saldo'},
                {path: '/payments/history', icon: 'bi-payment-history', label: 'Historial de abonos'},
            ]
        },
        {
            type: 'group',
            id: 'administracion',
            label: 'Administración',
            icon: 'bi-box-seam',
            items: [
                {path: '/products', icon: 'bi-box-seam', label: 'Productos'},
                {path: '/users', icon: 'bi bi-people', label: 'Usuarios'},
                {path: '/customers', icon: 'bi-people', label: 'Clientes'},
                {path: '/customer-types', icon: 'bi-category', label: 'Tipos de Clientes'},
            ]
        },
        {
            type: 'group',
            id: 'facturacion',
            label: 'Facturación',
            icon: 'bi-invoice',
            items: [
                {path: '/invoices', icon: 'bi-invoice', label: 'Facturas'},
                {path: '/customer-fiscal-data', icon: 'bi-receipt-fiscal', label: 'Datos Fiscales'},
            ]
        },
    ];

    const menuItems = hasLimitedAccess ? limitedMenuItems : fullMenuItems;

    // Riel: los grupos se aplanan a sus destinos y se separan con una línea.
    const railEntries = menuItems.flatMap((item, index) => {
        const links = item.type === 'group' ? item.items : [item];
        const entries = links.map((link) => ({kind: 'link', ...link}));
        return index > 0
            ? [{kind: 'divider', path: `divider-${item.id || item.path}`}, ...entries]
            : entries;
    });

    const userName = user || 'Admin User';

    const renderExpandedContent = (showCollapseToggle) => (
        <>
            {/* Header */}
            <Box sx={sidebarStyles.header}>
                <Typography
                    variant="h5"
                    sx={sidebarStyles.title}
                >
                    La Pasadita
                </Typography>
                {showCollapseToggle && (
                    <Tooltip title="Colapsar menú">
                        <IconButton
                            onClick={onToggleCollapse}
                            aria-label="Colapsar menú"
                            sx={{...sidebarStyles.toggleButton, ...sidebarStyles.headerToggle}}
                        >
                            <MenuOpen/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Navigation Menu */}
            <Box sx={sidebarStyles.navigationContainer}>
                <List>
                    {menuItems.map((item, index) => {
                        // Grupo colapsable (acordeón)
                        if (item.type === 'group') {
                            const isOpen = !!openGroups[item.id];
                            return (
                                <Box key={item.id}>
                                    <ListItem disablePadding sx={sidebarStyles.listItem}>
                                        <ListItemButton
                                            onClick={() => handleToggleGroup(item.id)}
                                            sx={sidebarStyles.groupHeader}
                                        >
                                            <ListItemIcon sx={sidebarStyles.listItemIcon(false)}>
                                                {getIcon(item.icon)}
                                            </ListItemIcon>
                                            <ListItemText primary={item.label}/>
                                            {isOpen
                                                ? <ExpandLess sx={sidebarStyles.expandIcon}/>
                                                : <ExpandMore sx={sidebarStyles.expandIcon}/>}
                                        </ListItemButton>
                                    </ListItem>
                                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.items.map((sub) => {
                                                const isSelected = location.pathname === sub.path;
                                                return (
                                                    <ListItem
                                                        key={sub.path}
                                                        disablePadding
                                                        sx={sidebarStyles.listItem}
                                                    >
                                                        <ListItemButton
                                                            component={Link}
                                                            to={sub.path}
                                                            selected={isSelected}
                                                            onClick={handleMenuItemClick}
                                                            sx={sidebarStyles.nestedListItemButton}
                                                        >
                                                            <ListItemIcon
                                                                sx={sidebarStyles.listItemIcon(isSelected)}>
                                                                {getIcon(sub.icon)}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={sub.label}
                                                                sx={sidebarStyles.listItemText(isSelected)}
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </Collapse>
                                </Box>
                            );
                        }

                        // Ítem directo
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
                                {userName}
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

    // Riel de iconos: mismo menú, sin etiquetas (tooltip + aria-label por destino).
    const railContent = (
        <>
            <Box sx={sidebarStyles.railHeader}>
                <Tooltip title="Expandir menú" placement="right">
                    <IconButton
                        onClick={onToggleCollapse}
                        aria-label="Expandir menú"
                        sx={sidebarStyles.toggleButton}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={sidebarStyles.navigationContainer}>
                <List disablePadding>
                    {railEntries.map((entry) => {
                        if (entry.kind === 'divider') {
                            return <Divider key={entry.path} component="li" sx={sidebarStyles.railDivider}/>;
                        }

                        const isSelected = location.pathname === entry.path;
                        return (
                            <ListItem key={entry.path} disablePadding sx={sidebarStyles.railListItem}>
                                <Tooltip title={entry.label} placement="right">
                                    <ListItemButton
                                        component={Link}
                                        to={entry.path}
                                        selected={isSelected}
                                        aria-label={entry.label}
                                        sx={sidebarStyles.railItemButton}
                                    >
                                        {getIcon(entry.icon)}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box sx={sidebarStyles.railProfile}>
                <Tooltip
                    title={`${userName} · ${hasLimitedAccess ? 'Usuario Limitado' : 'Administrador'}`}
                    placement="right"
                >
                    <Avatar sx={sidebarStyles.railAvatar}>
                        <Person/>
                    </Avatar>
                </Tooltip>
                <Tooltip title="Cerrar sesión" placement="right">
                    <IconButton
                        onClick={handlerLogout}
                        aria-label="Cerrar sesión"
                        sx={sidebarStyles.railLogoutButton}
                    >
                        <Logout/>
                    </IconButton>
                </Tooltip>
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
                    {renderExpandedContent(false)}
                </Drawer>
            ) : (
                /* Desktop Drawer (permanent): expandido o riel de iconos */
                <Drawer
                    variant="permanent"
                    sx={sidebarStyles.drawer(collapsed)}
                >
                    {collapsed ? railContent : renderExpandedContent(true)}
                </Drawer>
            )}
        </>
    );
};
