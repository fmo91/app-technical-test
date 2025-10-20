import React from 'react';
import ChatScreenContent from './ChatScreenContent';
import { useAppSelector } from "../redux/hooks";
import { receivedComponentEnd, receivedComponentField, receivedComponentStart, receivedMessageEnd, receivedMessageStart, receivedTextChunk, selectMessages, startStreaming, stopStreaming } from "../redux/features/chatSlice";
import { useDispatch } from 'react-redux';
import EventSource from 'react-native-sse';

if (__DEV__) {
  require("../ReactotronConfig");
}

const SUPPORTED_EVENTS = [
	'message_start',
	'text_chunk',
	'message_end',
	'component_start',
	'component_field',
	'component_end',
] as const;

export default function ChatScreen() {
  const eventSourceRef = React.useRef<EventSource | null>(null);
  const messages = useAppSelector(selectMessages);
  const isStreaming = useAppSelector(state => state.chat.isStreaming);

  const dispatch = useDispatch();
  
  React.useEffect(() => {
    const eventSource = new EventSource("https://api-dev.withallo.com/v1/demo/interview/conversation");
    eventSourceRef.current = eventSource;
    eventSource.close();
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const eventSource = eventSourceRef.current;
    if (eventSource && isStreaming) {
      eventSource.open();

      SUPPORTED_EVENTS.forEach(eventName =>
        eventSource.addEventListener(eventName as any, (event: MessageEvent<string>) => {
          const receivedEvent = {
            event: event.type,
            data: JSON.parse(event.data ?? '{}'),
          };

          switch (receivedEvent.event) {
          case 'message_start':
            dispatch(receivedMessageStart(receivedEvent.data));
            break;
          case 'text_chunk':
            dispatch(receivedTextChunk(receivedEvent.data));
            break;
          case 'message_end':
            dispatch(receivedMessageEnd());
            break;
          case 'component_start':
            dispatch(receivedComponentStart(receivedEvent.data));
            break;
          case 'component_field':
            dispatch(receivedComponentField(receivedEvent.data));
            break;
          case 'component_end':
            dispatch(receivedComponentEnd());
            break;
          }
        })
      );
    } else {
      eventSource?.removeAllEventListeners();
    }
  }, [isStreaming]);

  return (
    <ChatScreenContent 
      messagesList={messages}
      isStreaming={isStreaming}
      toggleIsStreaming={() => dispatch(isStreaming ? stopStreaming() : startStreaming())}
    />
  );
}