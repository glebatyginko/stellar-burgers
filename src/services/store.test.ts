import { rootReducer } from './store';
import { initialState as burgerConstructor } from './slices/burgerConstructorSlice';
import { initialState as feeds } from './slices/feedsSlice';
import { initialState as ingredients } from './slices/ingredientsSlice';
import { initialState as order } from './slices/ordersSlice';
import { initialState as user } from './slices/userSlice';

describe('rootReducer инициализирован', () => {
  it('Должен корректно инициализироваться и возвращать начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      burgerConstructor,
      feeds,
      ingredients,
      order,
      user
    });
  });
});
