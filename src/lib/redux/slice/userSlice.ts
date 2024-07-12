import { User, ProductOption } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type Cart =
  | (ProductOption & {
      quantity: number;
    })
  | null;
type InitialState = {
  user: null | User;
  isLoggedIn: boolean;
  cart: Cart;
};
const initialState: InitialState = {
  user: null,
  cart: {} as Cart,
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
        quantity: action.payload.quantity,
      };
    },
    removeCart: (state, _) => {
      state.cart = {} as Cart;
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
