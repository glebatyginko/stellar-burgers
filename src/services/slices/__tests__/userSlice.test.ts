import { TUser } from '@utils-types';
import {
  TUserState,
  authChecked,
  setUser,
  userLogout,
  registerUser,
  loginUser,
  updateUser,
  userSlice,
  initialState
} from '../userSlice';

describe('userSlice', () => {
  const userRegisterData = {
    email: 'test@yandex.ru',
    name: 'testName',
    password: 'testPassword'
  };

  const userLoginData = {
    email: 'test@yandex.ru',
    password: 'testPassword'
  };

  const userTestData: TUser = {
    email: 'test@test.ru',
    name: 'Gleb'
  };

  it('Устанавливает isAuthChecked в true при диспатче authChecked', () => {
    const expectedState: TUserState = {
      ...initialState,
      isAuthChecked: true
    };
    const actualState = userSlice.reducer(initialState, authChecked());
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить данные пользователя и установить isAuthenticated в true при вызове setUser', () => {
    const expectedState: TUserState = {
      ...initialState,
      data: userTestData,
      isAuthenticated: true
    };

    const actualState = userSlice.reducer(initialState, setUser(userTestData));

    expect(actualState).toEqual(expectedState);
  });

  it('Обнуление данных при диспатче userLogout', () => {
    const actualState = userSlice.reducer(
      {
        ...initialState,
        data: userTestData
      },
      userLogout()
    );
    expect(actualState).toEqual(initialState);
  });

  it('Должен установить registerUserRequest в true и сбросить registerUserError при registerUser.pending', () => {
    const expectedState: TUserState = {
      ...initialState,
      registerUserRequest: true
    };
    const actualState = userSlice.reducer(
      {
        ...initialState,
        registerUserError: 'Test Error'
      },
      registerUser.pending('', userRegisterData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние данными заказов и установить registerUserRequest в false при registerUser.fulfilled', () => {
    const expectedState: TUserState = {
      ...initialState,
      data: userTestData,
      isAuthChecked: true,
      isAuthenticated: true,
      registerUserRequest: false
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        registerUserRequest: true
      },
      registerUser.fulfilled(userTestData, '', userRegisterData)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние с ошибкой и установить registerUserRequest в false при dispatch registerUser.rejected', () => {
    const testError = new Error('test error');
    const expectedState: TUserState = {
      ...initialState,
      registerUserError: testError.message
    };
    const actualState = userSlice.reducer(
      {
        ...initialState,
        registerUserRequest: true
      },
      registerUser.rejected(testError, '', userRegisterData)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить loginUserRequest в true и сбросить loginUserError при loginUser.pending', () => {
    const expectedState: TUserState = {
      ...initialState,
      loginUserRequest: true
    };
    const actualState = userSlice.reducer(
      {
        ...initialState,
        loginUserError: 'Test Error'
      },
      loginUser.pending('', userLoginData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние данными пользователя и установить loginUserRequest в false при loginUser.fulfilled', () => {
    const expectedState: TUserState = {
      ...initialState,
      data: userTestData,
      isAuthenticated: true,
      isAuthChecked: true,
      loginUserRequest: false
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        loginUserRequest: true
      },
      loginUser.fulfilled(userTestData, '', userLoginData)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние с ошибкой и установить loginUserRequest в false при dispatch loginUser.rejected', () => {
    const testError = new Error('test login error');
    const expectedState: TUserState = {
      ...initialState,
      loginUserError: testError.message,
      loginUserRequest: false,
      isAuthChecked: true
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        loginUserRequest: true
      },
      loginUser.rejected(testError, '', userLoginData)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен установить updateUserRequest в true и сбросить updateUserError при updateUser.pending', () => {
    const expectedState: TUserState = {
      ...initialState,
      updateUserRequest: true
    };
    const actualState = userSlice.reducer(
      {
        ...initialState,
        updateUserError: 'Test Error'
      },
      updateUser.pending('', userRegisterData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние с данными пользователя и установить updateUserRequest в false при updateUser.fulfilled', () => {
    const expectedState: TUserState = {
      ...initialState,
      data: userTestData,
      updateUserRequest: false
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        updateUserRequest: true
      },
      updateUser.fulfilled(userTestData, '', userRegisterData)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('Должен обновить состояние с ошибкой и установить updateUserRequest в false при dispatch updateUser.rejected', () => {
    const testError = new Error('test update error');
    const expectedState: TUserState = {
      ...initialState,
      updateUserError: testError.message,
      updateUserRequest: false
    };

    const actualState = userSlice.reducer(
      {
        ...initialState,
        updateUserRequest: true
      },
      updateUser.rejected(testError, '', userRegisterData)
    );

    expect(actualState).toEqual(expectedState);
  });
});
