import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import AgentMessageRow from "./AgentMessageRow";
import { AgentMessage } from "@/utils/chat/models/AgentMessage";

describe("AgentMessageRow", () => {
	const textMessage: AgentMessage = {
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

	const componentMessage: AgentMessage = {
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

	test("renders plain text content when provided", async () => {
		render(<AgentMessageRow item={textMessage} />);
		const messageContent = await screen.findByTestId('message-content');
		expect(messageContent).toHaveTextContent("Ofcourse!I'dbehappytohelpyouscheduleameetingwithJohn.Letmechecktheavailableslotsfornextweek.");
	});

	test("renders a component calendar component when provided", async () => {
		render(<AgentMessageRow item={componentMessage} />);
		const messageContent = await screen.findByTestId('message-content');
		expect(messageContent).toHaveTextContent("IfoundagoodtimeslotforyourmeetingwithJohn.Here'stheproposedevent:");

		const calendarComponent = await screen.findByTestId('msg_2-calendar-event');
		expect(calendarComponent).toBeTruthy(); // It should exist
		expect(calendarComponent).toHaveTextContent("Meeting with John2025-10-2214:00PROPOSED");
	});

	test("renders a contact badge component when provided", async () => {
		render(<AgentMessageRow item={contactMessage} />);
		const messageContent = await screen.findByTestId('message-content');
		expect(messageContent).toHaveTextContent("Here'sSarah'scontactinformation:");

		const contactComponent = await screen.findByTestId('msg_3-contact-badge');
		expect(contactComponent).toBeTruthy(); // It should exist
		expect(contactComponent).toHaveTextContent("Sarah JohnsonTech Innovations Inc.sarah.johnson@example.com");
	});
});