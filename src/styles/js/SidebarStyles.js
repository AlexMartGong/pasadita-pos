export const SIDEBAR_WIDTH = 250;
// Ancho del riel de iconos (Sidebar colapsado en escritorio).
export const SIDEBAR_RAIL_WIDTH = 64;

const WIDTH_TRANSITION = 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)';

const SELECTED_COLOR = '#ff6b35';
const SELECTED_BACKGROUND = 'rgba(255, 107, 53, 0.15)';

export const sidebarStyles = {
  // Drawer permanente de escritorio: 250px expandido o riel de 64px colapsado.
  drawer: (collapsed) => {
    const width = collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH;
    return {
      width,
      flexShrink: 0,
      display: { xs: 'none', md: 'block' },
      transition: WIDTH_TRANSITION,
      '& .MuiDrawer-paper': {
        width,
        boxSizing: 'border-box',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderRight: 'none',
        boxShadow: '2px 0 10px rgba(0,0,0,0.15)',
        overflowX: 'hidden',
        transition: WIDTH_TRANSITION
      },
    };
  },

  drawerMobile: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      width: 280,
      boxSizing: 'border-box',
      backgroundColor: '#1a1a1a',
      color: 'white',
      borderRight: 'none',
      boxShadow: '2px 0 10px rgba(0,0,0,0.15)'
    },
  },

  header: {
    p: 3,
    borderBottom: '1px solid #333',
    position: 'relative'
  },

  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  // Botón colapsar/expandir: área táctil de 44x44px.
  toggleButton: {
    width: 44,
    height: 44,
    color: '#bbb',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },

  // Posición del botón "colapsar" dentro del header expandido (el título queda centrado).
  headerToggle: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: 'translateY(-50%)'
  },

  navigationContainer: {
    flexGrow: 1,
    py: 2
  },

  listItem: {
    mb: 0.5
  },

  listItemButton: (index) => ({
    mx: 1,
    borderRadius: 2,
    transition: 'all 0.3s ease',
    animationDelay: `${index * 0.1}s`,
    '&.Mui-selected': {
      backgroundColor: SELECTED_BACKGROUND,
      borderLeft: `4px solid ${SELECTED_COLOR}`,
      '& .MuiListItemIcon-root': {
        color: SELECTED_COLOR
      },
      '& .MuiListItemText-primary': {
        color: SELECTED_COLOR,
        fontWeight: 600
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateX(4px)'
    }
  }),

  groupHeader: {
    mx: 1,
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '& .MuiListItemIcon-root': {
      color: '#bbb'
    },
    '& .MuiListItemText-primary': {
      color: '#fff',
      fontSize: '0.95rem',
      fontWeight: 600
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },

  expandIcon: {
    color: '#bbb'
  },

  nestedListItemButton: {
    mx: 1,
    pl: 4,
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      backgroundColor: SELECTED_BACKGROUND,
      borderLeft: `4px solid ${SELECTED_COLOR}`,
      '& .MuiListItemIcon-root': {
        color: SELECTED_COLOR
      },
      '& .MuiListItemText-primary': {
        color: SELECTED_COLOR,
        fontWeight: 600
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateX(4px)'
    }
  },

  listItemIcon: (isSelected) => ({
    color: isSelected ? SELECTED_COLOR : '#bbb',
    minWidth: 40
  }),

  listItemText: (isSelected) => ({
    '& .MuiListItemText-primary': {
      fontSize: '0.95rem',
      color: isSelected ? SELECTED_COLOR : '#fff'
    }
  }),

  // ── Riel de iconos (Sidebar colapsado) ────────────────────────────────────

  // Misma altura que el header expandido para que el contenido no salte al colapsar.
  railHeader: {
    minHeight: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #333'
  },

  railListItem: {
    mb: 0.5,
    justifyContent: 'center'
  },

  // Ítem solo-icono: 48x48px centrado en el riel.
  railItemButton: {
    flexGrow: 0,
    width: 48,
    height: 48,
    p: 0,
    justifyContent: 'center',
    borderRadius: 2,
    color: '#bbb',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    '&.Mui-selected': {
      backgroundColor: SELECTED_BACKGROUND,
      color: SELECTED_COLOR,
      '&:hover': {
        backgroundColor: SELECTED_BACKGROUND
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff'
    }
  },

  railDivider: {
    borderColor: '#333',
    mx: 1.5,
    my: 1
  },

  railProfile: {
    mt: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
    py: 2,
    borderTop: '1px solid #333'
  },

  railAvatar: {
    width: 40,
    height: 40,
    backgroundColor: SELECTED_COLOR
  },

  railLogoutButton: {
    width: 44,
    height: 44,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: SELECTED_BACKGROUND,
      color: SELECTED_COLOR
    }
  },

  profileContainer: {
    mt: 'auto'
  },

  divider: {
    borderColor: '#333'
  },

  profilePaper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    p: 2,
    m: 2,
    borderRadius: 2
  },

  profileBox: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },

  avatar: {
    width: 40,
    height: 40,
    backgroundColor: SELECTED_COLOR,
    mr: 2
  },

  userName: {
    fontWeight: 600,
    color: '#fff'
  },

  userRole: {
    color: '#bbb'
  },

  logoutButton: {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    py: 1,
    '&:hover': {
      backgroundColor: SELECTED_BACKGROUND,
      color: SELECTED_COLOR
    }
  }
};
