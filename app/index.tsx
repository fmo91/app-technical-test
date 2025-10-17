import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  Pressable,
  FlatList
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useChatStore } from '@/state/store';
import { Chat } from '@/utils/chat/chat';
import { useChatConnection } from '@/utils/chat/useChatConnection';
import UserMessageRow from '@/components/UserMessageRow';
import AgentMessageRow from '@/components/AgentMessageRow';

const chat = new Chat();

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const store = useChatStore();

  useChatConnection(
    'https://api-dev.withallo.com/v1/demo/interview/conversation',
    (currentMessage) => {
      store.setMessage(currentMessage);
    },
    (message) => {
      store.addMessage(message);
    },
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <FlatList
          data={store.messages}
          keyExtractor={(item) => item.messageId}
          renderItem={({ item }) => {
            if (item.role === 'user') {
              return <UserMessageRow item={item} />;
            } else if (item.role === 'agent') {
              return <AgentMessageRow item={item} />;
            }
            return <></> // TODO: Handle this case properly
          }}
        />
      </View>

      <View
        style={[
          styles.controls,
          { paddingBottom: insets.bottom },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => {}}
          onPressIn={() => {
            store.toggleIsStreaming();
            hapticImpact(ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>
            {store.isStreaming ? "Stop Streaming" : "Start Streaming"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  content: {
    width: '100%',
    flex: 1,
  },
  controls: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e0e0e0',
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#FFE016',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonPressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.8,
  },
  buttonText: {
    color: '#002C2A',
    fontSize: 16,
    fontWeight: '600',
  },
});
