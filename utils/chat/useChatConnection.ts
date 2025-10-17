import { useEffect, useRef } from "react";
import EventSource from 'react-native-sse';
import { Chat } from "./chat";
import { ChatMessage } from "./models/ChatMessage";

export function useChatConnection(
	url: string, 
	onMessagesChange: (messages: ChatMessage[]) => void, 
) {
	const chatRef = useRef<Chat | null>(null);

	useEffect(() => {
		const chat = new Chat();
		chatRef.current = chat;

		const eventSource = new EventSource(url);
		const supportedEvents = [
			'message_start',
			'text_chunk',
			'message_end',
			'component_start',
			'component_field',
			'component_end',
		];

		const handleEvent = (event: MessageEvent<string>) => {
			try {
				chat.handleIncomingMessage({
					event: event.type,
					data: JSON.parse(event.data ?? '{}'),
				});
				let messages = chat.messages;
				if (chat.currentMessage) {
					messages = [...messages, chat.currentMessage];
				}
				onMessagesChange(messages);
			} catch (err) {
				console.warn('Bad payload', err);
			}
		};

		supportedEvents.forEach((eventName) =>
			eventSource.addEventListener(eventName as any, handleEvent),
		);

		return () => {
			supportedEvents.forEach((eventName) =>
				eventSource.removeEventListener(eventName as any, handleEvent),
			);
			eventSource.close();
			chatRef.current = null;
		};
	}, []);
}
