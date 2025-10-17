import React from 'react';
import ChatScreenContent from './ChatScreenContent';
import { useChatConnection } from '@/utils/chat/useChatConnection';

export default function ChatScreen() {
  const [isStreaming, setIsStreaming] = React.useState(false);

  const messages = useChatConnection('https://api-dev.withallo.com/v1/demo/interview/conversation');

  return (
    <ChatScreenContent 
      messagesList={messages}
      isStreaming={isStreaming}
      toggleIsStreaming={() => setIsStreaming(!isStreaming)}
    />
  );
}