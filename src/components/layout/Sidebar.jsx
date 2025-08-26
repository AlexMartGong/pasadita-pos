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
    Settings,
    Person,
    Logout
} from '@mui/icons-material';

export const Sidebar = () => {
    const location = useLocation();
    const {user, isAdmin, handlerLogout} = useAuth();

    const getIcon = (iconName) => {
        const icons = {
            'bi-speedometer2': <Dashboard/>,
            'bi-box-seam': <Inventory/>,
            'bi bi-people': <People/>,
            'bi-gear': <Settings/>
        };
        return icons[iconName] || <Dashboard/>;
    };

    const menuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {path: '/products', icon: 'bi-box-seam', label: 'Products'},
        ...(isAdmin ? [{path: '/users', icon: 'bi bi-people', label: 'Users'}] : []),
        {path: '/settings', icon: 'bi-gear', label: 'Settings'}
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    borderRight: 'none',
                    boxShadow: '2px 0 10px rgba(0,0,0,0.15)'
                },
            }}
        >
            {/* Header */}
            <Box sx={{p: 3, borderBottom: '1px solid #333'}}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: '#fff',
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    FruitApp
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{flexGrow: 1, py: 2}}>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.path} disablePadding sx={{mb: 0.5}}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    mx: 1,
                                    borderRadius: 2,
                                    transition: 'all 0.3s ease',
                                    animationDelay: `${index * 0.1}s`,
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(255, 107, 53, 0.15)',
                                        borderLeft: '4px solid #ff6b35',
                                        '& .MuiListItemIcon-root': {
                                            color: '#ff6b35'
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: '#ff6b35',
                                            fontWeight: 600
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: location.pathname === item.path ? '#ff6b35' : '#bbb',
                                    minWidth: 40
                                }}>
                                    {getIcon(item.icon)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontSize: '0.95rem',
                                            color: location.pathname === item.path ? '#ff6b35' : '#fff'
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* User Profile & Logout */}
            <Box sx={{mt: 'auto'}}>
                <Divider sx={{borderColor: '#333'}}/>
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        p: 2,
                        m: 2,
                        borderRadius: 2
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#ff6b35',
                                mr: 2
                            }}
                        >
                            <Person/>
                        </Avatar>
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{fontWeight: 600, color: '#fff'}}
                            >
                                {user || 'Admin User'}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{color: '#bbb'}}
                            >
                                Administrator
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        onClick={handlerLogout}
                        startIcon={<Logout/>}
                        sx={{
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            py: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 107, 53, 0.15)',
                                color: '#ff6b35'
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Paper>
            </Box>
        </Drawer>
    );
};