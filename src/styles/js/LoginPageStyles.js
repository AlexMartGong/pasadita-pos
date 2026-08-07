// Estilos de la pantalla de Login.
// Convención del proyecto: objetos sx planos exportados como constante nombrada.
// Identidad institucional: verde corporativo #2e7d32 sobre fondo neutro #f4f6f4.

const CORPORATE_GREEN = '#2e7d32';
const CORPORATE_GREEN_DARK = '#1b5e20';

export const loginPageStyles = {
  // Contenedor a pantalla completa: fondo neutro con degradados verde pastel en las esquinas
  container: {
    minHeight: '100vh',
    // Evita el salto por la barra de navegación en móviles
    '@supports (min-height: 100dvh)': {
      minHeight: '100dvh'
    },
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: { xs: '16px', sm: '24px', md: '32px' },
    backgroundColor: '#f4f6f4',
    backgroundImage: [
      'radial-gradient(circle at 0% 0%, rgba(165, 214, 167, 0.35) 0%, rgba(165, 214, 167, 0) 45%)',
      'radial-gradient(circle at 100% 100%, rgba(200, 230, 201, 0.45) 0%, rgba(200, 230, 201, 0) 50%)',
      'radial-gradient(circle at 100% 0%, rgba(232, 245, 233, 0.6) 0%, rgba(232, 245, 233, 0) 35%)'
    ].join(', '),
    backgroundAttachment: 'fixed'
  },

  // Tarjeta central
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '12px',
    border: '1px solid rgba(46, 125, 50, 0.08)',
    boxShadow: '0 8px 24px rgba(27, 94, 32, 0.10)'
  },

  cardContent: {
    padding: { xs: '24px', sm: '32px 40px' },
    // Neutraliza el padding-bottom extra que MUI aplica en el último hijo
    '&:last-child': {
      paddingBottom: { xs: '24px', sm: '32px' }
    }
  },

  // Cabecera
  header: {
    textAlign: 'center',
    marginBottom: '28px'
  },

  // Avatar con forma orgánica (guiño a la fruta), no un círculo perfecto
  avatar: {
    width: { xs: 64, sm: 72 },
    height: { xs: 64, sm: 72 },
    margin: '0 auto 16px',
    backgroundColor: '#e8f5e9',
    color: CORPORATE_GREEN,
    borderRadius: '46% 54% 52% 48% / 48% 46% 54% 52%'
  },

  storeIcon: {
    fontSize: { xs: 32, sm: 36 }
  },

  title: {
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: CORPORATE_GREEN_DARK,
    marginBottom: '4px'
  },

  subtitle: {
    color: 'text.secondary'
  },

  // Formulario
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  textField: {
    '& .MuiInputBase-root': {
      fontSize: { xs: '16px', md: '14px' } // Previene zoom en iOS
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(46, 125, 50, 0.45)'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: CORPORATE_GREEN,
        borderWidth: '1.5px'
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: CORPORATE_GREEN
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      color: 'text.secondary'
    }
  },

  loginButton: {
    minHeight: '48px',
    marginTop: '4px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.2px',
    boxShadow: 'none',
    backgroundColor: CORPORATE_GREEN,
    '&:hover': {
      backgroundColor: CORPORATE_GREEN_DARK,
      boxShadow: '0 4px 12px rgba(27, 94, 32, 0.24)'
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(46, 125, 50, 0.45)',
      color: '#ffffff'
    }
  },

  buttonSpinner: {
    marginRight: '10px'
  },

  // Pie de tarjeta
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    color: 'text.secondary'
  }
};

export default loginPageStyles;
