export const pageHeaderStyles = {
  container: {
    mb: 4,
    background: 'linear-gradient(135deg, #003c8f 0%, #005cb2 100%)',
    color: 'white',
    borderRadius: 2
  },

  content: {
    p: 4
  },

  titleSection: {
    display: 'flex',
    alignItems: 'center',
    mb: 2
  },

  icon: {
    fontSize: 40,
    mr: 2,
    opacity: 0.9
  },

  title: {
    fontWeight: 'bold',
    mb: 0.5,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },

  subtitle: {
    opacity: 0.9,
    fontSize: '1.1rem'
  },

  actionButton: {
    textDecoration: 'none',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    fontWeight: 'bold',
    px: 3,
    py: 1.5,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    }
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 3
  }
};

