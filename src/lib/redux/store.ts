import { userApi } from './query/userQuery';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
