import { configureStore } from '@reduxjs/toolkit';
import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { userSlice } from './slices/userSlice';
import { orderSlice } from './slices/ordersSlice';
import { feedsSlice } from './slices/feedsSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  userSlice,
  orderSlice,
  feedsSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
