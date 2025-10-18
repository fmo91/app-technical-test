import React from 'react';
import ChatScreenContent from './ChatScreenContent';
import { useAppSelector } from "../redux/hooks";
import { selectMessages, startStreaming } from "../redux/features/chatSlice";
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/redux/store';

function ChatScreen() {
  const messages = useAppSelector(selectMessages);
  const isStreaming = useAppSelector(state => state.chat.isStreaming);

  const dispatch = useDispatch();

  return (
    <ChatScreenContent 
      messagesList={messages}
      isStreaming={isStreaming}
      toggleIsStreaming={() => dispatch(startStreaming())}
    />
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ChatScreen />
    </Provider>
  );
}