import React from "react";
import { render, screen } from "@testing-library/react-native";
import { UserMessage } from "@/utils/chat/models/UserMessage";
import UserMessageRow from "./UserMessageRow";

describe("UserMessageRow", () => {
	const textMessage: UserMessage = {
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

	test("renders plain text content when provided", async () => {
		render(<UserMessageRow item={textMessage} />);
		const messageContent = await screen.findByTestId('message-content');
		expect(messageContent).toHaveTextContent("Hi!CanyouhelpmescheduleameetingwithJohnnextweek?");
	});
});
