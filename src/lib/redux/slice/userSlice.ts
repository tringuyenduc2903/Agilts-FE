import { User, ProductOption } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type InitialState = {
  user: null | User;
  isLoggedIn: boolean;
  curMotorbike: ProductOption | null;
};
const initialState: InitialState = {
  user: null,
  isLoggedIn: false,
  curMotorbike: null,
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
    setCurMotorbike: (state, action) => {
      state.curMotorbike = action.payload;
    },
  },
});

export const userInfo = (state: { user: InitialState }) => state.user.user;
export const userCurMotorbike = (state: { user: InitialState }) =>
  state.user.curMotorbike;
export const isLoggedInState = (state: { user: InitialState }) =>
  state.user.isLoggedIn;
export const { setUser, setIsLoggedIn, setCurMotorbike } = userSlice.actions;
export default userSlice.reducer;
