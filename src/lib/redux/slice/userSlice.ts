import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: {
    user: null,
  },
  reducers: {},
});
export default userSlice.reducer;
