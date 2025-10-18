import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chatSlice';
import { sseConnectionMiddleware } from './middlewares/sseConnection';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
	sseConnectionMiddleware,
  ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;