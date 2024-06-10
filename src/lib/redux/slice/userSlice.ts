import { User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type InitialState = {
  user: null | User;
};
const initialState: InitialState = {
  user: null,
};
export const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userInfo = (state: { user: InitialState }) => state.user.user;
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
