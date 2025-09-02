import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface BackdropLoadingProps {
  open: boolean;
  description?: string;
}

const BackdropLoading: React.FC<BackdropLoadingProps> = ({ open, description }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
  >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {description || 'Loading...'}
      </Typography>
    </div>
  </Backdrop>
);

export default BackdropLoading;
