import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
  registerUserError: string | null;
  registerUserRequest: boolean;
  updateUserError: string | null;
  updateUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (userData, { rejectWithValue }) => {
  const response = await registerUserApi(userData);

  if (!response?.success) {
    return rejectWithValue('Ошибка при регистрации');
  }

  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response.user;
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  const data = await loginUserApi({ email, password });

  if (!data?.success) {
    return rejectWithValue('Ошибка при авторизации');
  }

  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data.user;
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        if (response.success) {
          dispatch(setUser(response.user));
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации', error);
      }
    }
    dispatch(authChecked());
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  const response = await updateUserApi(userData);

  if (!response?.success) {
    return rejectWithValue('Ошибка при обновлении данных');
  }

  return response.user;
});

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear();
        deleteCookie('accessToken');
        dispatch(userLogout());
      })
      .catch((error) => {
        console.error('Ошибка выполнения выхода', error);
      });
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.data = action.payload;
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.payload || 'Ошибка при регистрации';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.registerUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload || 'Ошибка при авторизации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError =
          action.payload || 'Ошибка при обновлении данных';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.updateUserRequest = false;
      });
  }
});

export const { authChecked, setUser, userLogout } = userSlice.actions;
export default userSlice.reducer;
