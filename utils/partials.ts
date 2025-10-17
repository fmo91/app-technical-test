import { MessageRole } from "./chat/models/MessageRole";

export type PartialMessage<T extends { role: MessageRole ; messageId: string; content: object; }> = {
	role: T["role"];
	messageId: T["messageId"];
	content: Partial<T["content"]>;
}
