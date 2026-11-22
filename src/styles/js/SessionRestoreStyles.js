// Pantalla de arranque mientras se recupera la sesión con la cookie del refresh token.
// Reutiliza la tarjeta del login (loginPageStyles): al terminar, el cambio a la app o al login no salta.

const CORPORATE_GREEN = '#2e7d32';

export const sessionRestoreStyles = {
  // Misma altura aproximada que el formulario del login para que la tarjeta no cambie de tamaño
  status: {
    minHeight: '168px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    textAlign: 'center'
  },

  spinner: {
    color: CORPORATE_GREEN
  },

  message: {
    color: 'text.secondary'
  },

  errorTitle: {
    fontWeight: 600,
    color: 'text.primary'
  },

  actions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px'
  },

  secondaryButton: {
    minHeight: '48px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    color: CORPORATE_GREEN
  }
};

export default sessionRestoreStyles;
