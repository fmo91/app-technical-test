import React from 'react';
import ChatScreenContent from './ChatScreenContent';
import { useChatConnection } from '@/utils/chat/useChatConnection';
import { ChatMessage } from '@/utils/chat/models/ChatMessage';

export default function ChatScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);

  useChatConnection(
    'https://api-dev.withallo.com/v1/demo/interview/conversation',
    (messages) => {
      setMessages(messages);
    },
  );

  return (
    <ChatScreenContent 
      messagesList={messages}
      isStreaming={isStreaming}
      toggleIsStreaming={() => setIsStreaming(!isStreaming)}
    />
  );
}