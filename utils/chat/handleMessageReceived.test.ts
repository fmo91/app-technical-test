import { handleMessageReceived, State } from "./handleMessageReceived";
import { msg_0, msg_1, msg_2, sampleMessagesStream } from "./sampleMessageStream";

describe("handleMessageReceived() with sample message streams", () => {
	it("should end a message stream with finished_building_message state", () => {
		for (const [index, sampleStream] of [sampleMessagesStream].entries()) {
			let currentState: State = { state: "idle" };

			for (const message of sampleStream) {
				currentState = handleMessageReceived(currentState, message);
			}

			expect(currentState.state).toBe("finished_building_message" as const);
		}
	});

	it("should build a simple user text message correctly", () => {
		let currentState: State = { state: "idle" };

		for (const message of msg_0) {
			currentState = handleMessageReceived(currentState, message);
		}

		expect(currentState).toEqual({
			state: "finished_building_message",
			message: {
				role: "user",
				messageId: "msg_0",
				content: {
					text: "Hi! Can you help me schedule a meeting with John next week?",
				}
			}
		});
	});

	it("should build a simple agent text message correctly", () => {
		let currentState: State = { state: "idle" };

		for (const message of msg_1) {
			currentState = handleMessageReceived(currentState, message);
		}

		expect(currentState).toEqual({
			state: "finished_building_message",
			message: {
				role: "agent",
				messageId: "msg_1",
				content: {
					text: "Of course! I'd be happy to help you schedule a meeting with John. Let me check the available slots for next week.",
				}
			}
		});
	});

	it("should build an agent message with a component correctly", () => {
		let currentState: State = { state: "idle" };

		for (const message of msg_2) {
			currentState = handleMessageReceived(currentState, message);
		}

		expect(currentState).toEqual({
			state: "finished_building_message",
			message: {
				role: "agent",
				messageId: "msg_2",
				content: {
					text: "I found a good time slot for your meeting with John. Here's the proposed event:",
					component: {
						type: "calendar_event",
						metadata: {
							title: "Meeting with John",
							date: "2025-10-22",
							time: "14:00",
							status: "PROPOSED",
						}
					}
				}
			}
		});
	});
});

