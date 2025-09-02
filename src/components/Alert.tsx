import React from 'react';
import { useAlert } from '@provider/AlertProvider.js';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Alert: React.FC = () => {
  const { alert, hideAlert } = useAlert();
  if (!alert) return null;
  return (
    <MuiAlert
      severity={alert.type}
      sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, cursor: 'pointer', minWidth: 260, display: 'flex', alignItems: 'center' }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={hideAlert}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <Typography variant="body2">{alert.message}</Typography>
    </MuiAlert>
  );
};

export default Alert;
