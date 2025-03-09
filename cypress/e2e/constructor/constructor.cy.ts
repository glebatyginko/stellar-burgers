const testUrl = 'http://localhost:4000';

const bunIngredientsSelector = '[data-cy=bun-ingredients]';
const mainIngredientsSelector = '[data-cy=main-ingredients]';
const sauceIngredientsSelector = '[data-cy=sauce-ingredients]';
const constructorBun1Selector = '[data-cy=constructor-bun-1]';
const constructorBun2Selector = '[data-cy=constructor-bun-2]';
const constructorIngredientsSelector = '[data-cy=constructor-ingredients]';
const closeModalSelector = '[data-cy=close-modal]';
const orderNumberSelector = '[data-cy=order-number]';
const constructorSelector = '[data-cy=constructor]';
const modalOverlaySelector = '[data-cy=modal-overlay]';
const orderButtonSelector = '[data-cy=order-button]';

describe('Добавление ингредиентов в конструктор работает корректно', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  it('Добавление булки', () => {
    cy.get(bunIngredientsSelector).contains('Добавить').click();
    cy.get(constructorBun1Selector).contains('Ингредиент 1').should('exist');
    cy.get(constructorBun2Selector).contains('Ингредиент 1').should('exist');
  });

  it('Добавление ингредиентов', () => {
    cy.get(mainIngredientsSelector).contains('Добавить').click();
    cy.get(sauceIngredientsSelector).contains('Добавить').click();
    cy.get(constructorIngredientsSelector)
      .contains('Ингредиент 2')
      .should('exist');
    cy.get(constructorIngredientsSelector)
      .contains('Ингредиент 4')
      .should('exist');
  });
});

describe('Модальное окно ингредиента работает корректно', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  it('Открытие модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 2').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Ингредиент 2').should('exist');
  });

  it('Закрытие модального окна по кнопке', () => {
    cy.contains('Ингредиент 2').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeModalSelector).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.contains('Ингредиент 2').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(modalOverlaySelector).click('left', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('Оформление заказа работает корректно', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post-order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Бургер собирается', () => {
    cy.get(bunIngredientsSelector).contains('Добавить').click();
    cy.get(mainIngredientsSelector).contains('Добавить').click();
    cy.get(sauceIngredientsSelector).contains('Добавить').click();
    cy.get(orderButtonSelector).click();

    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '2', '4', '1']
      });

    cy.get(orderNumberSelector).contains('123321').should('exist');
    cy.get(closeModalSelector).click();
    cy.get(orderNumberSelector).should('not.exist');

    cy.get(constructorSelector).contains('Ингредиент 1').should('not.exist');
    cy.get(constructorSelector).contains('Ингредиент 2').should('not.exist');
    cy.get(constructorSelector).contains('Ингредиент 4').should('not.exist');
  });
});
