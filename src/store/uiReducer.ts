import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UILoadingState {
  isLoading: boolean;
  loadingDescription?: string;
}

const initialState: UILoadingState = {
  isLoading: false,
  loadingDescription: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = true;
      state.loadingDescription = action.payload || 'Loading...';
    },
    hideLoading: (state) => {
      state.isLoading = false;
      state.loadingDescription = '';
    },
  },
});

export const { showLoading, hideLoading } = uiSlice.actions;
export default uiSlice.reducer;
