import { create } from 'zustand'

interface ChatMessage {

}

interface ChatState {
	messages: ChatMessage[];
}

export const useChatStore = create<ChatState>()((set) => ({
	messages: [],
}))