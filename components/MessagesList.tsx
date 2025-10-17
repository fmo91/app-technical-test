import AgentMessageRow from "@/components/AgentMessageRow";
import UserMessageRow from "@/components/UserMessageRow";
import { ChatMessage } from "@/utils/chat/models/ChatMessage";
import React from "react";
import { FlatList } from "react-native";

interface MessagesListProps {
	messagesList: ChatMessage[];
}

export default function MessagesList({
	messagesList,
}: MessagesListProps) {
	return <FlatList
		data={messagesList}
		keyExtractor={(item) => item.messageId}
		renderItem={({ item }) => {
			switch (item.role) {
				case 'user':
					return <UserMessageRow item={item} />;
				case 'agent':
					return <AgentMessageRow item={item} />;
				default:
					return <></>; // TODO: Handle this case properly
			}
		}}
	/>;
}