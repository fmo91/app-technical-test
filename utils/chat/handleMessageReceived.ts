import { AgentMessage } from "./models/AgentMessage";
import { UserMessage } from "./models/UserMessage";

// This is a stateless function that handles incoming chat messages and updates the state machine accordingly.
export function handleMessageReceived(currentState: State, message: { event: string, data: object }): State {
	verifyEventIsValid(currentState, message.event);

	switch (message.event) {
		case "message_start": 
			return handleMessageStartReceived(currentState, message.data as NetworkPayloadMessageStart);
		case "text_chunk": 
			return handleTextChunkReceived(currentState, message.data as NetworkPayloadTextChunk);
		case "message_end":
			return handleMessageEndReceived(currentState);
		case "component_start": 
			return handleComponentStartReceived(currentState, message.data as NetworkPayloadComponentStart);
		case "component_field": 
			return handleComponentFieldReceived(currentState, message.data as NetworkPayloadComponentField);
		case "component_end": 
			return handleComponentEndReceived(currentState);
	}
	return currentState;
}

function handleMessageStartReceived(currentState: State, payload: NetworkPayloadMessageStart): State {
	return {
		state: "building_message_text",
		message: {
			role: payload.role,
			messageId: payload.messageId,
			content: {
				textChunks: [],
			}
		}
	};
}

function handleTextChunkReceived(currentState: State, payload: NetworkPayloadTextChunk): State {
	const state = currentState as BuildingMessageText;
	// TODO: Think of using Immer here. I preferred to keep it simple for now.
	return {
		...state,
		message: {
			...state.message,
			content: {
				...state.message.content,
				textChunks: [...state.message.content.textChunks, payload.chunk],
			}
		}
	};
}

function handleMessageEndReceived(currentState: State): State {
	const messageEndCurrentState = currentState as BuildingMessageText | FinishedBuildingMessageComponent;
	return {
		state: "finished_building_message",
		message: messageEndCurrentState.message as UserMessage | AgentMessage,
	}
}

function handleComponentStartReceived(currentState: State, payload: NetworkPayloadComponentStart): State {
	const state = currentState as BuildingMessageText;

	const agentMessage = state.message as AgentMessage;

	const newState: BuildingMessageComponent = {
		state: "building_message_component",
		message: {
			...agentMessage,
			content: {
				...agentMessage.content,
				component: {
					type: payload.componentType,
					metadata: {},
				}
			}
		}
	};

	return newState
}

function handleComponentFieldReceived(currentState: State, payload: NetworkPayloadComponentField): State {
	const state = currentState as BuildingMessageComponent;
	const newState: BuildingMessageComponent = {
		...state,
		message: {
			...state.message,
			content: {
				...state.message.content,
				component: {
					...state.message.content.component!,
					// @ts-ignore
					metadata: {
						...state.message.content.component!.metadata,
						[payload.field]: payload.value,
					}
				}
			}
		}
	};

	return newState;
}

function handleComponentEndReceived(currentState: State): State {
	return {
		state: "finished_building_message_component",
		message: (currentState as BuildingMessageComponent).message,
	};
}

// small utilities
function verifyEventIsValid(state: State, event: string) {
}

// Networking messages
type NetworkPayloadMessageStart =  { event: "message_start"; messageId: string; role: "user" | "agent"; };
type NetworkPayloadTextChunk =  { event: "text_chunk"; messageId: string; chunk: string; index: number; };
type NetworkPayloadComponentStart =  { event: "component_start"; messageId: string; componentType: "contact_badge" | "calendar_event"; };
type NetworkPayloadComponentField =  { event: "component_field"; messageId: string; field: string; value: string; };

// ***** Finite state machine types

export type State = Idle | BuildingMessageText | BuildingMessageComponent | FinishedBuildingMessageComponent | FinishedBuildingMessage;

// I am waiting for the first message to start
type Idle = { state: "idle" };

// this is the case in which I have received a message_start but no message_end yet
type BuildingMessageText = {
	state: "building_message_text";
	message: UserMessage | AgentMessage;
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
	message: UserMessage | AgentMessage;
};