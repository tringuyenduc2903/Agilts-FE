import { User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type InitialState = {
  user: null | User;
  isLoggedIn: boolean;
};
const initialState: InitialState = {
  user: null,
  isLoggedIn: false,
};
export const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const userInfo = (state: { user: InitialState }) => state.user.user;
export const isLoggedInState = (state: { user: InitialState }) =>
  state.user.isLoggedIn;
export const { setUser, setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;
