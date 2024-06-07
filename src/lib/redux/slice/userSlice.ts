import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: null,
  },
  reducers: {},
});

export const userInfo = (state: any) => state.user.user;
export default userSlice.reducer;
