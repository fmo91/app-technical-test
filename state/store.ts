import { Chat } from '@/utils/chat/chat';
import { AgentMessage } from '@/utils/chat/models/AgentMessage';
import { UserMessage } from '@/utils/chat/models/UserMessage';
import { create, } from 'zustand';

export type ChatMessage = AgentMessage | UserMessage;

interface ChatState {
	messages: ChatMessage[];
	currentMessage: ChatMessage | null;
	isStreaming: boolean;
	setMessage: (message: ChatMessage | null) => void;
	addMessage: (message: ChatMessage) => void;
	toggleIsStreaming: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
	messages: [],
	currentMessage: null,
	isStreaming: false,
	setMessage: message => set((state) => {
		if (state.messages.map(msg => msg.messageId).includes(message?.messageId ?? "")) {
			// Duplicate message, ignore
			return state;
		}
		return { ...state, currentMessage: message }
	}),
	addMessage: (message: ChatMessage) => set((state) => {
		if (state.messages.map(msg => msg.messageId).includes(message.messageId)) {
			// Duplicate message, ignore
			return state;
		}

		return { ...state, messages: [...state.messages, message] };
	}),
	toggleIsStreaming: () => set((state) => ({ ...state, isStreaming: !state.isStreaming })),
}));
