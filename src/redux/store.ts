import AuthReducer from './slices/AuthSlice';
import PipReducer from './slices/PipSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
const store = configureStore({
  reducer: {
    auth: AuthReducer,
    pip: PipReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
