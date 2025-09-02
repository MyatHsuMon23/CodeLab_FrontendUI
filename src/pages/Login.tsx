import React, { FC, useContext, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Stack,
  TextField,
  FormControl,
  FormHelperText,
  useTheme,
  Button,
  Divider
} from "@mui/material";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import LoadingButton from '@mui/lab/LoadingButton';
import { RootState } from "@store/reduxStore";
import { useNavigate } from "react-router";
import { encrypt, getClaimsFromToken } from "@util/auth";
import { ApiEndpoints } from "@api/endpoints";
import { useBackendLogin } from "@hook/auth/useBackendLogin";
import { setTokens } from "@store/authReducer";

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
const Login: FC = (): any => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const { loginToBackend } = useBackendLogin();

  const onSubmit = async (data: any) => {
    const payload = {
      userName: data?.username,
      password: encrypt(data?.password),
    };

    setLoading(true);
    const result = await loginToBackend(payload);
  };

  const handleDemoLogin = () => {
    // Demo login for testing flight management features
    dispatch(setTokens({
      accessToken: 'demo-access-token-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now()
    }));
    navigate('/flights');
  };
  const theme = useTheme();
  return (
    <Box sx={{
      background: '#FFF',
      padding: {
        xs: '1.5em',
        sm: '2em 2em 1em 2em',
        md: '3em 3em 1.5em 3em'
      },
      borderRadius: '20px',
      boxShadow: `0 0 5px ${theme.palette.primary.main}`
    }}>
      <Box
        component='div'
        textAlign={'center'}
        marginBottom={'2em'}
      >
        <Typography variant="body2" sx={{fontSize: '15px'}}>
          Welcome! Please log in
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth variant="outlined" size='small' sx={{ fontSize: { xs: '9pt', sm: '9pt', md: '10pt' } }}>
          <TextField
            size="small"
            id="outlined-adornment-username"
            label="Username"
            {...register('username')}
          />
        </FormControl>
        {errors.username?.message && <FormHelperText style={{ color: '#ef1620' }}>Login Id is required</FormHelperText>}
        <Stack><br /></Stack>
        <FormControl fullWidth variant="outlined" size='small' sx={{ fontSize: { xs: '9pt', sm: '9pt', md: '10pt' } }}>
          <TextField
            size="small"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff color="primary" /> : <Visibility color="primary" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            label="Password"
            {...register('password')}
          />
        </FormControl>
        {errors.password?.message && <FormHelperText style={{ color: '#ef1620' }}>Password is required</FormHelperText>}

        <Stack style={{ marginTop: '20px' }}>
          <LoadingButton
            type="submit"
            loading={isLoading}
            endIcon={<></>}
            loadingPosition="end"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main'
            }}
            style={{
              border: isLoading ? `1px solid ${theme.palette.primary.main}` : 'none',
              color: isLoading ? theme.palette.primary.main : theme.palette.common.white
            }}
          >
            Login
          </LoadingButton>
        </Stack>

      </form>

      {/* Demo Login Section */}
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Demo Mode
          </Typography>
        </Divider>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleDemoLogin}
          sx={{ 
            textTransform: 'none',
            py: 1.5
          }}
        >
          🚀 Demo Login (Skip Authentication)
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Click here to explore the Flight Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;

