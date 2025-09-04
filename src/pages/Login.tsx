import React, { FC, useState } from "react";
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
  Button
} from "@mui/material";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { encrypt } from "@util/auth";
import { useBackendLogin } from "@hook/auth/useBackendLogin";

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
  const [isLoading, setLoading] = useState(false);
  const { loginToBackend } = useBackendLogin();

  const onSubmit = async (data: any) => {
    const payload = {
      userName: data?.username,
      password: encrypt(data?.password),
    };

    setLoading(true);
    const result = await loginToBackend(payload);
    setLoading(false);
    if (result && result.success) {
      navigate('/flights');
    }
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
          <Button
            type="submit"
            loading={isLoading}
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
          </Button>
        </Stack>

      </form>
    </Box>
  );
};

export default Login;

