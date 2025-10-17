export type UserMessage = {
	role: "user";
	messageId: string;
	content: {
		textChunks: string[];
	};
}; 