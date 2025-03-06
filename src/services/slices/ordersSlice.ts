import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TOrderState = {
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  ordersHistory: TOrder[];
  orderRequest: boolean;
  ordersHistoryRequest: boolean;
  orderError: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  orderModalData: null,
  ordersHistory: [],
  orderRequest: false,
  ordersHistoryRequest: false,
  orderError: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  } catch (error) {
    return rejectWithValue('Ошибка при создании заказа');
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных заказа');
  }
});

export const fetchOrdersHistory = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/fetchOrdersHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке истории заказов');
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload || 'Ошибка при создании заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError =
          action.payload || 'Ошибка при получении данных заказа';
      })
      .addCase(fetchOrdersHistory.pending, (state) => {
        state.ordersHistoryRequest = true;
        state.orderError = null;
      })
      .addCase(
        fetchOrdersHistory.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.ordersHistoryRequest = false;
          state.ordersHistory = action.payload;
        }
      )
      .addCase(fetchOrdersHistory.rejected, (state, action) => {
        state.ordersHistoryRequest = false;
        state.orderError =
          action.payload || 'Ошибка при загрузке истории заказов';
      });
  }
});

export const { clearOrder, clearOrderModalData } = orderSlice.actions;

export const dataSelector = (number: string) => (state: RootState) => {
  if (state.order.ordersHistory.length) {
    const data = state.order.ordersHistory.find(
      (order) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.feeds.orders.length) {
    const data = state.feeds.orders.find(
      (order) => order.number === Number(number)
    );
    if (data) return data;
  }

  if (state.order.currentOrder?.number) {
    return state.order.currentOrder;
  }

  return null;
};

export default orderSlice.reducer;
