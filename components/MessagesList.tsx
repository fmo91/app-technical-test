import AgentMessageRow from "@/components/AgentMessageRow";
import UserMessageRow from "@/components/UserMessageRow";
import { ChatMessage } from "@/utils/chat/models/ChatMessage";
import React, { useRef } from "react";
import { FlatList, InteractionManager } from "react-native";

interface MessagesListProps {
	messagesList: ChatMessage[];
}

export default function MessagesList({
	messagesList,
}: MessagesListProps) {

  	const flatListRef = useRef<FlatList>(null);

	return <FlatList
		data={messagesList}
		keyExtractor={(item) => item.messageId}
		ref={flatListRef}
		onContentSizeChange={() => {
			InteractionManager.runAfterInteractions(() => {
				flatListRef.current?.scrollToEnd({ animated: true });
			});
		}}
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