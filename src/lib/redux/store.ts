import { userApi } from './query/userQuery';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import { csrfApi } from './query/csrfQuery';
import { countryApi } from './query/countryQuery';
import { storesApi } from './query/storesQuery';
import { priceQuoteApi } from './query/priceQuoteQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [csrfApi.reducerPath]: csrfApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [storesApi.reducerPath]: storesApi.reducer,
    [priceQuoteApi.reducerPath]: priceQuoteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      csrfApi.middleware,
      countryApi.middleware,
      storesApi.middleware,
      priceQuoteApi.middleware
    ),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
