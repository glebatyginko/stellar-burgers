import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
