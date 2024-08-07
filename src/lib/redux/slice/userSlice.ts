import { User, ProductOption } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type InitialState = {
  user: null | User;
  curMotorbike: ProductOption | null;
};
const initialState: InitialState = {
  user: null,
  curMotorbike: null,
};
export const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCurMotorbike: (state, action) => {
      state.curMotorbike = action.payload;
    },
  },
});

export const userInfo = (state: { user: InitialState }) => state.user.user;
export const userCurMotorbike = (state: { user: InitialState }) =>
  state.user.curMotorbike;
export const { setUser, setCurMotorbike } = userSlice.actions;
export default userSlice.reducer;
