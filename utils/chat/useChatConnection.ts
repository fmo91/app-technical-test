import { useCallback, useEffect, useRef, useState } from 'react';
import EventSource from 'react-native-sse';
import { Chat } from './chat';
import { ChatMessage } from './models/ChatMessage';

const SUPPORTED_EVENTS = [
  'message_start',
  'text_chunk',
  'message_end',
  'component_start',
  'component_field',
  'component_end',
] as const;

export function useChatConnection(
  url: string,
  streamingEnabled: boolean,
): ChatMessage[] {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const handleEventRef = useRef<((event: MessageEvent<string>) => void) | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const tearDownEventSource = useCallback(() => {
	const eventSource = eventSourceRef.current;
	const handleEvent = handleEventRef.current;

	if (eventSource && handleEvent) {
	  SUPPORTED_EVENTS.forEach((eventName) =>
		eventSource.removeEventListener(eventName as any, handleEvent),
	  );
	}

	if (eventSource) {
	  eventSource.close();
	}

	eventSourceRef.current = null;
	handleEventRef.current = null;
  }, []);

  useEffect(() => {
	const chat = new Chat();
	chatRef.current = chat;
	setMessages([]);

	return () => {
	  tearDownEventSource();
	  chatRef.current = null;
	};
  }, [url, tearDownEventSource]);

  useEffect(() => {
	if (!streamingEnabled) {
	  tearDownEventSource();
	  return;
	}

	if (eventSourceRef.current) {
	  // Already streaming for this configuration.
	  return;
	}

	const eventSource = new EventSource(url);
	eventSourceRef.current = eventSource;

	const handleEvent = (event: MessageEvent<string>) => {
	  const chat = chatRef.current;
	  if (!chat) {
		return;
	  }

	  try {
		chat.handleIncomingMessage({
		  event: event.type,
		  data: JSON.parse(event.data ?? '{}'),
		});

		const baseMessages = [...chat.messages];
		const nextMessages = chat.currentMessage
		  ? [...baseMessages, chat.currentMessage]
		  : baseMessages;

		setMessages(nextMessages);
	  } catch (err) {
		console.warn('Bad payload', err);
	  }
	};

	handleEventRef.current = handleEvent;

	SUPPORTED_EVENTS.forEach((eventName) =>
	  eventSource.addEventListener(eventName as any, handleEvent),
	);

	return () => {
	  if (eventSourceRef.current === eventSource) {
		tearDownEventSource();
	  } else {
		SUPPORTED_EVENTS.forEach((eventName) =>
		  eventSource.removeEventListener(eventName as any, handleEvent),
		);
		eventSource.close();
	  }
	};
  }, [streamingEnabled, url, tearDownEventSource]);

  return messages;
}
