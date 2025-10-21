import { UserMessage } from '@/utils/chat/models/UserMessage';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StreamingText from './StreamingText';

export default function UserMessageRow({ item }: { item: UserMessage }) {
  return (
    <View style={styles.container} testID={ item.messageId + '-user-row' }>
      <View style={styles.bubble}>
        <StreamingText chunks={item.content.textChunks} messageId={item.messageId} testID='message-content' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#DCF8C6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 4,
    textAlign: 'right',
  },
});
