import { userApi } from './query/userQuery';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import { csrfApi } from './query/csrfQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [csrfApi.reducerPath]: csrfApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, csrfApi.middleware),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
