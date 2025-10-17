import { PartialMessage } from "../partials";
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
				text: "",
			}
		}
	};
}

function handleTextChunkReceived(currentState: State, payload: NetworkPayloadTextChunk): State {
	const textChunkCurrentState = currentState as BuildingMessageText;

	textChunkCurrentState.message.content.text += payload.chunk;

	// TODO: Think of using Immer here. I preferred to keep it simple for now.
	return textChunkCurrentState;
}

function handleMessageEndReceived(currentState: State): State {
	const messageEndCurrentState = currentState as BuildingMessageText | FinishedBuildingMessageComponent;
	return {
		state: "finished_building_message",
		message: messageEndCurrentState.message as UserMessage | AgentMessage,
	}
}

function handleComponentStartReceived(currentState: State, payload: NetworkPayloadComponentStart): State {
	const componentStartCurrentState = currentState as BuildingMessageText;

	const componentStartAgentMessage = componentStartCurrentState.message as AgentMessage;
	componentStartAgentMessage.content.component = {
		type: payload.componentType,
		metadata: {},
	};
	componentStartCurrentState.message = componentStartAgentMessage;

	return {
		state: "building_message_component",
		message: componentStartCurrentState.message as AgentMessage,
	};
}

function handleComponentFieldReceived(currentState: State, payload: NetworkPayloadComponentField): State {
	const componentFieldCurrentState = currentState as BuildingMessageComponent;
	componentFieldCurrentState.message.content.component!.metadata = {
		...componentFieldCurrentState.message.content.component!.metadata,
		[payload.field]: payload.value,
	};
	return componentFieldCurrentState;
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
// type NetworkPayloadMessageEnd =  { event: "message_end"; messageId: string; }; // Not needed as a type since it has no extra data
type NetworkPayloadComponentStart =  { event: "component_start"; messageId: string; componentType: "contact_badge" | "calendar_event"; };
type NetworkPayloadComponentField =  { event: "component_field"; messageId: string; field: string; value: string; };
// type NetworkPayloadComponentEnd =  { event: "component_end"; messageId: string; }; // Not needed as a type since it has no extra data

// ***** Finite state machine types

export type State = Idle | BuildingMessageText | BuildingMessageComponent | FinishedBuildingMessageComponent | FinishedBuildingMessage;

// I am waiting for the first message to start
type Idle = { state: "idle" };

// this is the case in which I have received a message_start but no message_end yet
type BuildingMessageText = {
	state: "building_message_text";
	message: PartialMessage<UserMessage> | PartialMessage<AgentMessage>;
};
type BuildingMessageComponent = {
	state: "building_message_component";
	message: PartialMessage<AgentMessage>;
};
type FinishedBuildingMessageComponent = {
	state: "finished_building_message_component";
	message: PartialMessage<AgentMessage>;
};

// Here I have received message_end, so I have a complete message, and I am waiting for the next message_start
type FinishedBuildingMessage = {
	state: "finished_building_message";
	message: UserMessage | AgentMessage;
};