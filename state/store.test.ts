import { useChatStore } from "./store";

describe("useChatStore", () => {
	it("should initialize with an empty messages array", () => {
		const messages = [];
		expect(messages.length).toBe(0);
	});
});
