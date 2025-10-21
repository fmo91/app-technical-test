import React from "react";
import { render, screen } from "@testing-library/react-native";
import { AgentMessage } from "@/utils/chat/models/AgentMessage";
import { UserMessage } from "@/utils/chat/models/UserMessage";
import MessagesList from "./MessagesList";

describe("MessagesList", () => {
	const userTextMessage: UserMessage = {
		role: "user",
		messageId: "msg_0",
		content: {
			textChunks: [
				"Hi!",
				"Can",
				"you",
				"help",
				"me",
				"schedule",
				"a",
				"meeting",
				"with",
				"John",
				"next",
				"week?"
			]
		},
	};

	const agentTextMessage: AgentMessage = {
		role: "agent",
		messageId: "msg_1",
		content: {
			textChunks: [
				"Of",
				"course!",
				"I'd",
				"be",
				"happy",
				"to",
				"help",
				"you",
				"schedule",
				"a",
				"meeting",
				"with",
				"John.",
				"Let",
				"me",
				"check",
				"the",
				"available",
				"slots",
				"for",
				"next",
				"week."
			]
		}
	};

	const agentComponentMessage: AgentMessage = {
		role: "agent",
		messageId: "msg_2",
		content: {
			textChunks: [
				"I",
				"found",
				"a",
				"good",
				"time",
				"slot",
				"for",
				"your",
				"meeting",
				"with",
				"John.",
				"Here's",
				"the",
				"proposed",
				"event:"
			],
			component: {
				type: "calendar_event",
				metadata: {
					title: "Meeting with John",
					date: "2025-10-22",
					time: "14:00",
					status: "PROPOSED"
				}
			}
		}
	};

	const contactMessage: AgentMessage = {
		role: "agent",
		messageId: "msg_3",
		content: {
			textChunks: [
				"Here's",
				"Sarah's",
				"contact",
				"information:",
			],
			component: {
				type: "contact_badge",
				metadata: {
					name: "Sarah Johnson",
					email: "sarah.johnson@example.com",
					company: "Tech Innovations Inc.",
					profilePicture: "https://i.pravatar.cc/150?img=5",
				},
			},
		},
	};

	test("renders a list of messages", async () => {
		render(<MessagesList messagesList={[
			userTextMessage,
			agentTextMessage,
			agentComponentMessage,
		]} />);
		expect(screen.getByTestId("messages-list")).toBeTruthy();
		expect(screen.getAllByTestId("msg_0-user-row")).toBeTruthy();
		expect(screen.getAllByTestId("msg_1-agent-row")).toBeTruthy();
		expect(screen.getAllByTestId("msg_2-agent-row")).toBeTruthy();
	});
});