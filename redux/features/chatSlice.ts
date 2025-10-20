import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ChatMessage } from '@/utils/chat/models/ChatMessage'
import { AgentMessage } from '@/utils/chat/models/AgentMessage';

// Define a type for the slice state
interface ChatState {
  isStreaming: boolean;
  messages: ChatMessage[];
  currentMessageState: CurrentMessageState
}

export type CurrentMessageState = Idle | BuildingMessageText | BuildingMessageComponent | FinishedBuildingMessageComponent | FinishedBuildingMessage;

// I am waiting for the first message to start
type Idle = { state: "idle" };

// this is the case in which I have received a message_start but no message_end yet
type BuildingMessageText = {
  state: "building_message_text";
  message: ChatMessage;
};
type BuildingMessageComponent = {
  state: "building_message_component";
  message: AgentMessage;
};
type FinishedBuildingMessageComponent = {
  state: "finished_building_message_component";
  message: AgentMessage;
};

// Here I have received message_end, so I have a complete message, and I am waiting for the next message_start
type FinishedBuildingMessage = {
  state: "finished_building_message";
  message: ChatMessage;
};

// Define the initial state using that type
const initialState: ChatState = {
  isStreaming: false,
  messages: [],
  currentMessageState: { state: "idle"  },
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    startStreaming: (state) => {
      state.isStreaming = true;
    },
    stopStreaming: (state) => {
      state.isStreaming = false;
    },
    receivedMessageStart: (state, action: PayloadAction<{ role: 'user' | 'agent'; messageId: string }>) => {
      state.currentMessageState = {
        state: "building_message_text",
        message: {
          role: action.payload.role,
          messageId: action.payload.messageId,
          content: {
            textChunks: [],
          }
        }
      };
    },
    receivedTextChunk: (state, action: PayloadAction<{ chunk: string }>) => {
      if (state.currentMessageState.state !== "building_message_text") {
        return;
      }
      const textChunks = state.currentMessageState.message.content.textChunks;
      state.currentMessageState = {
        ...state.currentMessageState,
        message: {
          ...state.currentMessageState.message,
          content: {
            ...state.currentMessageState.message.content,
            textChunks: [...textChunks, action.payload.chunk],
          }
        }
      };
    },
    receivedMessageEnd: (state) => {
      if (state.currentMessageState.state !== "building_message_text") {
        return;
      }
      state.currentMessageState = {
        state: "finished_building_message",
        message: state.currentMessageState.message,
      };
      if (!state.messages.map(m => m.messageId).includes(state.currentMessageState.message.messageId)) {
        state.messages.push(state.currentMessageState.message);
      }
    },
    receivedComponentStart: (state, action: PayloadAction<{ componentType: string }>) => {
      if (state.currentMessageState.state !== "building_message_text") {
        return;
      }
      const agentMessage = state.currentMessageState.message;

      state.currentMessageState = {
        state: "building_message_component",
        message: {
          ...agentMessage,
          content: {
            ...agentMessage.content,
            component: {
              // @ts-ignore
              type: action.payload.componentType,
              metadata: {},
            }
          }
        }
      };
    },
    receivedComponentField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      if (state.currentMessageState.state !== "building_message_component") {
        return;
      }
      const component = state.currentMessageState.message.content.component!;

      state.currentMessageState = {
        ...state.currentMessageState,
        message: {
          ...state.currentMessageState.message,
          content: {
            ...state.currentMessageState.message.content,
            component: {
              ...component,
              // @ts-ignore
              metadata: {
                ...component.metadata,
                [action.payload.field]: action.payload.value,
              }
            }
          }
        }
      };
    },
    receivedComponentEnd: (state) => {
      if (state.currentMessageState.state !== "building_message_component") {
        return;
      }
      state.currentMessageState = {
        state: "finished_building_message",
        message: state.currentMessageState.message,
      };

      if (!state.messages.map(m => m.messageId).includes(state.currentMessageState.message.messageId)) {
        state.messages.push(state.currentMessageState.message);
      }
    },
  },
});

export const { 
  setMessages, 
  startStreaming, 
  stopStreaming,
  receivedMessageStart,
  receivedTextChunk,
  receivedMessageEnd,
  receivedComponentStart,
  receivedComponentField,
  receivedComponentEnd,
 } = chatSlice.actions;

export const selectMessages = (state: RootState) => {
  const { messages, currentMessageState } = state.chat;
  const currentMessage = currentMessageState.state === "building_message_text" || currentMessageState.state === "building_message_component"
    ? currentMessageState.message
    : null;
  if (currentMessage && !messages.map(m => m.messageId).includes(currentMessage.messageId)) {
    return [...messages, currentMessage];
  } else {
    return [...messages];
  }
};

export default chatSlice.reducer