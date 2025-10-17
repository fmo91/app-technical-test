export type AgentMessage = {
	role: "agent";
	messageId: string;
	content: {
		textChunks: string[];
		component?: AgentMessageComponent;
	}
}

// ContactBadgeComponent
export type AgentMessageComponent =
  | ContactBadgeComponent
  | CalendarEventComponent;

type ContactBadgeComponent = {
	type: "contact_badge";
	metadata: ContactBadgeComponentMetadata;
};

export type ContactBadgeComponentMetadata = Partial<{
	name: string;
	email: string;
	company: string;
	profilePicture: string;
}>;

// CalendarEventComponent
type CalendarEventComponent = {
	type: "calendar_event";
	metadata: CalendarEventComponentMetadata;
};

export type CalendarEventComponentMetadata = Partial<{
	title: string;
	date: string;
	time: string;
	status: "PROPOSED" | "CONFIRMED" | "CANCELLED"; 
}>;