// Estilos para tarjetas de estadísticas reutilizables
export const statsCardStyles = {
  container: {
    mb: 4,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 3
  },

  card: {
    borderRadius: 2,
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)'
    }
  },

  label: {
    fontWeight: 500
  },

  value: {
    fontWeight: 'bold'
  },

  // Colores específicos para diferentes tipos de métricas
  colors: {
    primary: 'primary.main',
    success: 'success.main',
    info: 'info.main',
    warning: 'warning.main',
    error: 'error.main'
  }
};

