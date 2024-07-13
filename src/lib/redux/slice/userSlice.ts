import { User, ProductOption } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type Cart =
  | ProductOption & {
      name: string;
      quantity: number;
    };
type InitialState = {
  user: null | User;
  isLoggedIn: boolean;
  cart: Cart | null;
};
const initialState: InitialState = {
  user: null,
  cart: null,
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
    setCart: (state, action) => {
      state.cart = {
        ...action.payload.item,
        name: action.payload.name,
        quantity: action.payload.quantity,
      };
    },
    removeCart: (state, _) => {
      state.cart = null;
    },
  },
});

export const userInfo = (state: { user: InitialState }) => state.user.user;
export const isLoggedInState = (state: { user: InitialState }) =>
  state.user.isLoggedIn;
export const userCart = (state: { user: InitialState }) => state.user.cart;
export const { setUser, setIsLoggedIn, setCart, removeCart } =
  userSlice.actions;
export default userSlice.reducer;
