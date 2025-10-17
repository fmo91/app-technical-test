import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  Pressable,
  FlatList
} from 'react-native';
import EventSource from 'react-native-sse';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useChatStore } from '@/state/store';
import { Chat } from '@/utils/chat/chat';

const chat = new Chat();

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const store = useChatStore();

  useEffect(() => {
    const eventSource = new EventSource("https://api-dev.withallo.com/v1/demo/interview/conversation");
    const supportedEvents = [
      'message_start',
      'text_chunk',
      'message_end',
      'component_start',
      'component_field',
      'component_end',
    ];

    const handleEvent = (event: MessageEvent<string>) => {
      try {
        chat.handleIncomingMessage({
          event: event.type,
          data: JSON.parse(event.data ?? '{}'),
        });

        store.setMessage(chat.currentMessage);
        if (chat.state.state === 'finished_building_message') {
          console.log('Adding message to store', chat.state.message);
          store.addMessage(chat.state.message);
        }

      } catch (err) {
        console.warn('Bad payload', err);
      }
    };

    supportedEvents.forEach((eventName) =>
      eventSource.addEventListener(eventName as any, handleEvent),
    );

    return () => {
      supportedEvents.forEach((eventName) =>
        eventSource.removeEventListener(eventName as any, handleEvent),
      );
      eventSource.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <FlatList
          data={store.messages}
          keyExtractor={(item) => item.messageId}
          renderItem={({ item }) => (
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.role.toUpperCase()}</Text>
              <Text>{item.content.text}</Text>
            </View>
          )}
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
          onPressIn={() => hapticImpact(ImpactFeedbackStyle.Light)}
        >
          <Text style={styles.buttonText}>
            Start Stream
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
