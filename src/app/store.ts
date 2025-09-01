import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

function loadCartState() {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: loadCartState(),
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.cart));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
