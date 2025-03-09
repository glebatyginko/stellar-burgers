import {
  ingredientsSlice,
  fetchIngredients,
  TIngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Ingredient 1',
      type: 'main',
      proteins: 10,
      fat: 5,
      carbohydrates: 30,
      calories: 100,
      price: 50,
      image: 'ingredient1.jpg',
      image_large: 'ingredient1_large.jpg',
      image_mobile: 'ingredient1_mobile.jpg'
    },
    {
      _id: '2',
      name: 'Ingredient 2',
      type: 'main',
      proteins: 8,
      fat: 4,
      carbohydrates: 25,
      calories: 90,
      price: 40,
      image: 'ingredient2.jpg',
      image_large: 'ingredient2_large.jpg',
      image_mobile: 'ingredient2_mobile.jpg'
    }
  ];

  it('Должен установить isLoading в true и сбросить error при fetchIngredients.pending', () => {
    const expectedState = {
      ...initialState,
      isLoading: true
    };
    const actualState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить ingredients и установить isLoading в false при fetchIngredients.fulfilled', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      ingredients: mockIngredients
    };
    const actualState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить ошибку и установить isLoading в false при fetchIngredients.rejected', () => {
    const testError = new Error('Ошибка загрузки');
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: testError.message
    };
    const actualState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.rejected(testError, '', undefined)
    );
    expect(actualState).toEqual(expectedState);
  });
});
