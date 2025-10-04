export const sidebarStyles = {
  drawer: {
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
  },

  header: {
    p: 3,
    borderBottom: '1px solid #333'
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

  navigationContainer: {
    flexGrow: 1,
    py: 2
  },

  listItem: {
    mb: 0.5
  },

  listItemButton: (index, isSelected) => ({
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
  }),

  listItemIcon: (isSelected) => ({
    color: isSelected ? '#ff6b35' : '#bbb',
    minWidth: 40
  }),

  listItemText: (isSelected) => ({
    '& .MuiListItemText-primary': {
      fontSize: '0.95rem',
      color: isSelected ? '#ff6b35' : '#fff'
    }
  }),

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
    backgroundColor: '#ff6b35',
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
      backgroundColor: 'rgba(255, 107, 53, 0.15)',
      color: '#ff6b35'
    }
  }
};
