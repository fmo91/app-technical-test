// import { Chat } from "./chat";
// import { sampleMessagesStream } from "./sampleMessageStream";

// describe("Chat", () => {
// 	it("should initialize with idle state and empty messages", () => {
// 		const chat = new Chat();
// 		expect(chat.state).toEqual({ state: "idle" });
// 		expect(chat.messages).toEqual([]);
// 		expect(chat.currentMessage).toBeNull();
// 	});

// 	it("should handle incoming messages and build complete messages", () => {
// 		const chat = new Chat();

// 		const incomingMessages = sampleMessagesStream;

// 		for (const message of incomingMessages) {
// 			chat.handleIncomingMessage(message);
// 		}

// 		expect(chat.state).toEqual({ state: "finished_building_message", message: expect.any(Object) });
// 		expect(chat.messages).toEqual([
// 			{
// 				role: 'user',
// 				messageId: 'msg_0',
// 				content: {
// 					text: 'Hi! Can you help me schedule a meeting with John next week?'
// 				}
// 			},
// 			{
// 				role: 'agent',
// 				messageId: 'msg_1',
// 				content: {
// 					text: "Of course! I'd be happy to help you schedule a meeting with John. Let me check the available slots for next week."
// 				}
// 			},
// 			{
// 				role: 'agent',
// 				messageId: 'msg_2',
// 				content: {
// 					text: "I found a good time slot for your meeting with John. Here's the proposed event:",
// 					component: {
// 						metadata: {
// 							date: "2025-10-22",
// 							status: "PROPOSED",
// 							time: "14:00",
// 							title: "Meeting with John"
// 						},
// 						type: "calendar_event",
// 					}
// 				}
// 			}
// 		]);
// 		expect(chat.currentMessage).toBeNull();
// 	});
// });