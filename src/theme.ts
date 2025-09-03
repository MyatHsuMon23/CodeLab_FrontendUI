import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D2732F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00263D', 
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#fff',
    },
    text: {
      primary: '#364261',
      secondary: '#5c6b7a',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ffb300',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#43a047',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: '0.95rem',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: '0.95rem',
          minHeight: '32px',
          padding: '4px 16px',
        },
        outlined: {
          color: '#D2732F',
          fontWeight: 700,
          fontSize: '14px',
          border: '2px solid #D2732F',
          backgroundColor: '#ECF0FA',
          textTransform: 'none',
          padding: '4px 10px',
          minHeight: '32px',
          '&:hover': {
            borderColor: '#00263D',
            color: '#00263D',
            backgroundColor: 'transparent',
          },
        },
        contained: {
          backgroundColor: '#D2732F',
          color: '#fff',
          fontWeight: 700,
          fontSize: '14px',
          borderRadius: '8px',
          textTransform: 'none',
          minHeight: '32px',
          boxShadow: 'none',
          padding: '4px 16px',
          '&:hover': {
            backgroundColor: '#00263D',
            color: '#fff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #76716d85',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        underline: {
          '&:after': {
            borderBottomColor: '#e09c5d', // your desired color
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            fontSize: 15,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          padding: '0 7px !important',
        },
        deleteIcon: {
          fontSize: 18, // your custom font size
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 600,
          color: '#5b5858',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 200,
          padding: '8px 18px',
        },
        message: {
          display: 'flex',
          alignItems: 'center',
        },
        action: {
          marginLeft: '16px',
        },
      },
    // MuiButton overrides and defaultProps merged above
      },
    },
  },
);

export default theme;
