import { handleMessageReceived, State } from "./handleMessageReceived";
import { AgentMessage } from "./models/AgentMessage";
import { UserMessage } from "./models/UserMessage";

export class Chat {
	state: State;
	messages: (AgentMessage | UserMessage)[];
	currentMessage: AgentMessage | UserMessage | null;

	constructor() {
		this.state = { state: "idle" };
		this.messages = [];
		this.currentMessage = null;
	}

	handleIncomingMessage(message: { event: string, data: object }) {
		const newState = handleMessageReceived(this.state, message);
		this.state = newState;

		// If we have finished building a message, we add it to the messages array
		if (newState.state === "finished_building_message") {
			this.currentMessage = null;

			if (this.messages.map(msg => msg.messageId).includes(newState.message.messageId)) {
				// Duplicate message, ignore
				return;
			}
			this.messages.push(newState.message);
		} else if (newState.state === "building_message_text" || newState.state === "building_message_component") {
			if (this.messages.map(msg => msg.messageId).includes(newState.message.messageId)) {
				// Duplicate message, ignore
				return;
			}

			this.currentMessage = newState.message;
		}
	}
}
