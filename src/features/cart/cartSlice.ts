import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export interface CartTicket {
  uid: string;        // уникальный id записи в корзине
  flightId: string;
  seatCode: string;   // напр. "B3"
  price: number;      // итоговая цена за место
}

export interface CartState {
  items: CartTicket[];
}

const initialState: CartState = {
  items: [],
};

interface AddTicketPayload {
  flightId: string;
  seatCode: string;
  price: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addTicket: {
      reducer(state, action: PayloadAction<CartTicket>) {
        // не добавляем дубликаты по flightId+seatCode
        const exists = state.items.some(
          (x) => x.flightId === action.payload.flightId && x.seatCode === action.payload.seatCode
        );
        if (!exists) state.items.push(action.payload);
      },
      prepare({ flightId, seatCode, price }: AddTicketPayload) {
        return { payload: { uid: nanoid(), flightId, seatCode, price } };
      },
    },
    removeTicket(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.uid !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addTicket, removeTicket, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
