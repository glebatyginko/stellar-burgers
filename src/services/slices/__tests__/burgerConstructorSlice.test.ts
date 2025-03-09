import { omit } from 'lodash';

import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const testBun: TConstructorIngredient = {
    id: 'fixed-id',
    _id: '1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 30,
    calories: 200,
    price: 50,
    image: 'bun.jpg',
    image_large: 'bun_large.jpg',
    image_mobile: 'bun_mobile.jpg'
  };

  const testIngredient: TConstructorIngredient = {
    id: 'fixed-id',
    _id: '2',
    name: 'Test Ingredient',
    type: 'ingredient',
    proteins: 5,
    fat: 2,
    carbohydrates: 10,
    calories: 100,
    price: 30,
    image: 'ingredient.jpg',
    image_large: 'ingredient_large.jpg',
    image_mobile: 'ingredient_mobile.jpg'
  };

  const mockIngredients: TConstructorIngredient[] = [
    {
      _id: '1',
      id: 'fixed-id-1',
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
      id: 'fixed-id-2',
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

  const sortedIngredients: TConstructorIngredient[] = [
    {
      _id: '2',
      id: 'fixed-id-2',
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
    },
    {
      _id: '1',
      id: 'fixed-id-1',
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
    }
  ];

  it('Должен добавить ингредиент в bun или ingredients при вызове addIngredient', () => {
    const bunState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(testBun)
    );
    expect(omit(bunState.bun, 'id')).toEqual(omit(testBun, 'id'));
    expect(bunState.ingredients).toHaveLength(0);

    const ingredientState = burgerConstructorSlice.reducer(
      bunState,
      addIngredient(testIngredient)
    );

    expect(ingredientState.ingredients).toHaveLength(1);
    expect(omit(ingredientState.ingredients[0], 'id')).toEqual(
      omit(testIngredient, 'id')
    );
  });

  it('Должен удалить ингредиент по id при вызове removeIngredient', () => {
    const stateWithIngredient = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(testIngredient)
    );

    const ingredientId = stateWithIngredient.ingredients[0].id;
    const newState = burgerConstructorSlice.reducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(newState.ingredients).toHaveLength(0);
  });

  it('Должен перемещать ингредиенты в массиве при вызове moveIngredient', () => {
    const result = burgerConstructorSlice.reducer(
      { ...initialState, ingredients: mockIngredients },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(result).toEqual({
      ...initialState,
      ingredients: sortedIngredients
    });
  });

  it('Должен очистить конструктор при вызове clearConstructor', () => {
    const result = burgerConstructorSlice.reducer(
      { ...initialState, ingredients: mockIngredients },
      clearConstructor()
    );

    expect(result).toEqual({
      ...initialState,
      ingredients: []
    });
  });
});
