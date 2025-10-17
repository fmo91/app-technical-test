import { Chat } from '@/utils/chat/chat';
import { AgentMessage } from '@/utils/chat/models/AgentMessage';
import { UserMessage } from '@/utils/chat/models/UserMessage';
import { PartialMessage } from '@/utils/partials';
import { create, } from 'zustand';

type ChatMessage = AgentMessage | UserMessage;
type InProgressMessage = PartialMessage<UserMessage> | PartialMessage<AgentMessage>;

interface ChatState {
	messages: ChatMessage[];
	currentMessage: InProgressMessage | null;
	setMessage: (message: InProgressMessage | null) => void;
	addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
	messages: [],
	currentMessage: null,
	setMessage: message => set((state) => ({ ...state, currentMessage: message })),
	addMessage: (message: ChatMessage) => set((state) => {
		return { ...state, messages: [...state.messages, message] };
	}),
}));
