import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User{
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    name: '',
    email: '',
    accessToken: '',
    refreshToken: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        name: '',
        email: '',
        accessToken: '',
        refreshToken: '',
      };
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.user = {
        name: state.user?.name || '',
        email: state.user?.email || '',
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
  },
});

export const { logout, setTokens } = authSlice.actions;
export default authSlice.reducer;
