import { createSlice } from '@reduxjs/toolkit';

import { retrieveStoredToken } from './authFunctions';

const tokenData = retrieveStoredToken();

const initialState = {
  token: tokenData ? tokenData.token : '',
  isLoggedIn: localStorage.getItem('token') ? true : false,
  //   login: (token) => {},
  //   logout: () => {},
};

export const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
    },
    login: (state, action) => {
      const payload = action.payload;
      state.token = payload['token'];
      localStorage.setItem('token', payload['token']);
      localStorage.setItem('expirationTime', payload['expirationTime'])
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

// Note: auth slice has a name 'userAuth' which is needed when using useSelector during retrieval of state in our redux, and its better practice to initialize a var here and export it to use it to components.

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectToken = (state) => state.userAuth.token;
export const authActions = authSlice.actions;
export default authSlice.reducer; // authReducer
