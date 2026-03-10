// Estilos reutilizables para formularios
export const formStyles = {
  cardHeader: {
    background: 'linear-gradient(135deg, #003c8f 0%, #005cb2 100%)',
    color: 'white',
    borderRadius: '8px 8px 0 0',
    padding: '16px'
  },
  // Estilos responsivos para contenedor de formularios
  formContainer: {
    width: '100%',
    maxWidth: '100%',
    padding: { xs: '8px', sm: '16px', md: '24px' }
  },
  // Estilos para campos de formulario en móvil
  formField: {
    marginBottom: '16px',
    '& .MuiInputBase-root': {
      fontSize: { xs: '16px', md: '14px' } // Previene zoom en iOS
    }
  },
  // Card responsivo
  cardResponsive: {
    width: '100%',
    margin: { xs: '0', sm: '0 auto' },
    maxWidth: { xs: '100%', sm: '600px', md: '800px' }
  }
};

export default formStyles;
