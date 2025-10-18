import { Middleware } from 'redux';
import EventSource from 'react-native-sse';
import { handleMessageReceived, State } from '@/utils/chat/handleMessageReceived';
import { ChatMessage } from '@/utils/chat/models/ChatMessage';
import { addMessage, setCurrentMessage, setMessages } from '../features/chatSlice';
import { RootState } from '../store';

const SUPPORTED_EVENTS = [
	'message_start',
	'text_chunk',
	'message_end',
	'component_start',
	'component_field',
	'component_end',
] as const;

export const sseConnectionMiddleware: Middleware = ({ dispatch, getState }) => next => action => {
	console.log("sseConnectionMiddleware");

	if ((action as any).type === "chat/startStreaming") {
		const eventSource = new EventSource("https://api-dev.withallo.com/v1/demo/interview/conversation");
		let currentState: State = { state: "idle" };

		SUPPORTED_EVENTS.forEach((eventName) =>
		eventSource.addEventListener(eventName as any, (event: MessageEvent<string>) => {
			currentState = handleMessageReceived(currentState, {
				event: event.type,
				data: JSON.parse(event.data ?? '{}'),
			});

			if (currentState.state === "finished_building_message") {
				console.log("Finished building message", currentState.message);
				dispatch(addMessage(currentState.message));
			} else if (currentState.state === "building_message_text" || currentState.state === "building_message_component") {
				dispatch(setCurrentMessage(currentState.message));
			}
		}));
	}

	return next(action);
};
