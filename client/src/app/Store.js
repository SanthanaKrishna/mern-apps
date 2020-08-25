import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger'
import { shoppingListReducer } from '../components/shoppingList/ShoppingListSlice';
import { authReducer } from '../components/auth/AuthSlice';
import { errorReducer } from '../components/auth/ErrorSlice';

const middleware = [...getDefaultMiddleware(), logger]

export default configureStore({
  reducer: {
    shoppingState: shoppingListReducer,
    authState: authReducer,
    errorState: errorReducer
  },
  middleware,
});
