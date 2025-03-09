import { fetchFeeds, feedsSlice, TFeedsState } from '../feedsSlice';
import { TOrder } from '@utils-types';

describe('feedsSlice', () => {
  const initialState: TFeedsState = {
    orders: [],
    totalOrders: 0,
    ordersToday: 0,
    isLoading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      name: 'Burger 1',
      status: 'done',
      createdAt: '2024-03-09T12:00:00Z',
      updatedAt: '2024-03-09T12:30:00Z',
      number: 1001,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      name: 'Burger 2',
      status: 'pending',
      createdAt: '2024-03-09T12:10:00Z',
      updatedAt: '2024-03-09T12:40:00Z',
      number: 1002,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockResponse = {
    success: true,
    orders: mockOrders,
    total: 1000,
    totalToday: 50
  };

  it('Должен установить isLoading в true при fetchFeeds.pending', () => {
    const expectedState: TFeedsState = {
      ...initialState,
      isLoading: true,
      error: null
    };
    const actualState = feedsSlice.reducer(
      initialState,
      fetchFeeds.pending('', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить заказы и снять isLoading при fetchFeeds.fulfilled', () => {
    const expectedState: TFeedsState = {
      ...initialState,
      orders: mockResponse.orders,
      totalOrders: mockResponse.total,
      ordersToday: mockResponse.totalToday,
      isLoading: false
    };

    const actualState = feedsSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeeds.fulfilled(mockResponse, '', undefined)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить ошибку и снять isLoading при fetchFeeds.rejected', () => {
    const testError = new Error('Ошибка загрузки');
    const expectedState: TFeedsState = {
      ...initialState,
      error: testError.message,
      isLoading: false
    };

    const actualState = feedsSlice.reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeeds.rejected(testError, '', undefined)
    );

    expect(actualState).toEqual(expectedState);
  });
});
