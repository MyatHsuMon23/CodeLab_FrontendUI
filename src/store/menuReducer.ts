import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuState {
  selectedMenu: string;
    subTitle?: string;
}

const initialState: MenuState = {
  selectedMenu: 'Create',
    subTitle: 'Create FTA Check'
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedMenu(state, action: PayloadAction<{ selectedMenu: string; subTitle: string }>) {
      state.selectedMenu = action.payload.selectedMenu;
      state.subTitle = action.payload.subTitle;
    },
  },
});

export const { setSelectedMenu } = menuSlice.actions;
export default menuSlice.reducer;
