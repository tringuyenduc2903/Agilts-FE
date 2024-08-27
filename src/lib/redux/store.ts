import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import { countryApi } from './query/countryQuery';
import { appApi } from './query/appQuery';
import { adminApi } from './query/adminQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [appApi.reducerPath]: appApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      countryApi.middleware,
      appApi.middleware,
      adminApi.middleware
    ),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
