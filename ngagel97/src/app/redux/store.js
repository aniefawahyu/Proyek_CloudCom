import { configureStore } from '@reduxjs/toolkit';
import tictactoeReducer from './tictactoeSlice';

export const store = configureStore({
  reducer: {
    tictactoe: tictactoeReducer,
  },
});