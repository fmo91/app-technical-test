export type UserMessage = {
	role: "user";
	messageId: string;
	content: {
		text: string;
	};
}; 