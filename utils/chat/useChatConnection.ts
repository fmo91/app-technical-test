import { useEffect, useRef } from "react";
import EventSource from 'react-native-sse';
import { Chat } from "./chat";
import { UserMessage } from "./models/UserMessage";
import { AgentMessage } from "./models/AgentMessage";

export function useChatConnection(
	url: string, 
	onCurrentMessageUpdate: (message: UserMessage | AgentMessage) => void,
	onMessageComplete: (message: UserMessage | AgentMessage) => void, 
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
				onCurrentMessageUpdate(chat.currentMessage!);
				if (chat.state.state === 'finished_building_message') {
					onMessageComplete(chat.state.message);
				}
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
