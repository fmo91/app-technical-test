export type AgentMessage = {
	role: "agent";
	messageId: string;
	content: {
		text: string;
		component: PartialComponent<ContactBadgeComponent> | PartialComponent<CalendarEventComponent>;
	}
}

type PartialComponent<T extends { type: string; metadata: object }> = {
	type: T["type"];
	metadata: Partial<T["metadata"]>;
};

type ContactBadgeComponent = {
	type: "contact_badge";
	metadata: {
		name: string;
		email: string;
		company: string;
		profilePicture: string;
	};
};

type CalendarEventComponent = {
	type: "calendar_event";
	metadata: {
		title: string;
		date: string;
		time: string;
		status: "PROPOSED" | "CONFIRMED" | "CANCELLED"; 
	};
};