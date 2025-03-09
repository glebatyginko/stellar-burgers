import { TOrder } from '@utils-types';
import {
  TOrderState,
  createOrder,
  fetchOrderByNumber,
  fetchOrdersHistory,
  clearOrder,
  clearOrderModalData,
  orderSlice
} from '../ordersSlice';

describe('orderSlice', () => {
  const initialState: TOrderState = {
    currentOrder: null,
    orderModalData: null,
    ordersHistory: [],
    orderRequest: false,
    ordersHistoryRequest: false,
    orderError: null
  };

  const testOrder: TOrder = {
    _id: '12345',
    status: 'completed',
    name: 'Test Order',
    createdAt: '2025-03-01T12:00:00Z',
    updatedAt: '2025-03-01T12:30:00Z',
    number: 1,
    ingredients: ['ingredient1', 'ingredient2', 'ingredient3']
  };

  it('Должен очистить текущий заказ при вызове clearOrder', () => {
    const expectedState = {
      ...initialState,
      currentOrder: null
    };
    const actualState = orderSlice.reducer(
      { ...initialState, currentOrder: testOrder },
      clearOrder()
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен очистить данные модального окна заказа при вызове clearOrderModalData', () => {
    const expectedState = {
      ...initialState,
      orderModalData: null
    };
    const actualState = orderSlice.reducer(
      { ...initialState, orderModalData: testOrder },
      clearOrderModalData()
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить orderRequest в true при createOrder.pending', () => {
    const expectedState = {
      ...initialState,
      orderRequest: true,
      orderError: null
    };
    const actualState = orderSlice.reducer(
      initialState,
      createOrder.pending('', ['ingredient1', 'ingredient2'])
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние с данными заказа и установить orderRequest в false при createOrder.fulfilled', () => {
    const expectedState = {
      ...initialState,
      orderRequest: false,
      orderModalData: testOrder
    };
    const actualState = orderSlice.reducer(
      initialState,
      createOrder.fulfilled(testOrder, '', ['ingredient1', 'ingredient2'])
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить orderError и orderRequest в false при createOrder.rejected', () => {
    const testError = new Error('Ошибка при создании заказа');
    const expectedState = {
      ...initialState,
      orderRequest: false,
      orderError: testError.message
    };
    const actualState = orderSlice.reducer(
      initialState,
      createOrder.rejected(testError, '', ['ingredient1', 'ingredient2'])
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить orderRequest в true при fetchOrderByNumber.pending', () => {
    const expectedState = {
      ...initialState,
      orderRequest: true,
      orderError: null
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrderByNumber.pending('', 1)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить currentOrder и установить orderRequest в false при fetchOrderByNumber.fulfilled', () => {
    const expectedState = {
      ...initialState,
      orderRequest: false,
      currentOrder: testOrder
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrderByNumber.fulfilled(testOrder, '', 1)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить orderError и orderRequest в false при fetchOrderByNumber.rejected', () => {
    const testError = new Error('Ошибка при получении данных заказа');
    const expectedState = {
      ...initialState,
      orderRequest: false,
      orderError: testError.message
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrderByNumber.rejected(testError, '', 1)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить ordersHistoryRequest в true при fetchOrdersHistory.pending', () => {
    const expectedState = {
      ...initialState,
      ordersHistoryRequest: true,
      orderError: null
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrdersHistory.pending('', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить ordersHistory и установить ordersHistoryRequest в false при fetchOrdersHistory.fulfilled', () => {
    const expectedState = {
      ...initialState,
      ordersHistoryRequest: false,
      ordersHistory: [testOrder]
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrdersHistory.fulfilled([testOrder], '', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить orderError и ordersHistoryRequest в false при fetchOrdersHistory.rejected', () => {
    const testError = new Error('Ошибка при загрузке истории заказов');
    const expectedState = {
      ...initialState,
      ordersHistoryRequest: false,
      orderError: testError.message
    };
    const actualState = orderSlice.reducer(
      initialState,
      fetchOrdersHistory.rejected(testError, '', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });
});
