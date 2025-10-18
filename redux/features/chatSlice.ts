import { createSlice } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ChatMessage } from '@/utils/chat/models/ChatMessage'

// Define a type for the slice state
interface ChatState {
  isStreaming: boolean;
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
}

// Define the initial state using that type
const initialState: ChatState = {
  isStreaming: false,
  messages: [],
  currentMessage: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.messages.map(m => m.messageId).includes(action.payload.messageId)) {
        // This message is repeated.
        return;
      }
      state.messages.push(action.payload);
      state.currentMessage = null;
    },
    setCurrentMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.messages.map(m => m.messageId).includes(action.payload.messageId)) {
        // This message is repeated.
        return;
      }
      state.currentMessage = action.payload;
    },
    startStreaming: (state) => {
      state.isStreaming = true;
    },
    stopStreaming: (state) => {
      state.isStreaming = false;
    },
  },
});

export const { setMessages, addMessage, setCurrentMessage, startStreaming, stopStreaming } = chatSlice.actions;

export const selectMessages = (state: RootState) => {
  const { messages, currentMessage } = state.chat;
  if (currentMessage) {
    return [...messages, currentMessage];
  } else {
    return [...messages];
  }
};

export default chatSlice.reducer