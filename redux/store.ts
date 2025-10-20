import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chatSlice';

const createEnhancers = (getDefaultEnhancers: any) => {
  if (__DEV__) {
    const reactotron = require("../ReactotronConfig").default
    return getDefaultEnhancers().concat(reactotron.createEnhancer())
  } else {
    return getDefaultEnhancers()
  }
}

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  enhancers: createEnhancers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
