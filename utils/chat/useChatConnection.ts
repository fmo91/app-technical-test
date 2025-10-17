import { useCallback, useEffect, useRef, useState } from 'react';
import { Chat } from './chat';
import { ChatMessage } from './models/ChatMessage';
import { useEventSourceConnection } from './useEventSourceConnection';

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
  const chatRef = useRef<Chat | null>(null);

  const handleEvent = useCallback(
	(event: MessageEvent<string>) => {
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
	},
	[setMessages],
  );

  const { tearDown } = useEventSourceConnection({
	url,
	enabled: streamingEnabled,
	eventNames: SUPPORTED_EVENTS,
	onEvent: handleEvent,
  });

  useEffect(() => {
	const chat = new Chat();
	chatRef.current = chat;
	setMessages([]);

	return () => {
	  tearDown();
	  chatRef.current = null;
	};
  }, [tearDown, url]);

  return messages;
}
