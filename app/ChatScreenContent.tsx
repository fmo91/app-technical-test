import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import MessagesList from '../components/MessagesList';
import { ChatMessage } from '@/state/store';

interface ChatScreenContentProps {
	messagesList: ChatMessage[];
	isStreaming: boolean;
	toggleIsStreaming: () => void;
}

export default function ChatScreenContent({
  messagesList,
  isStreaming,
  toggleIsStreaming,
}: ChatScreenContentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <MessagesList messagesList={messagesList} />
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
            toggleIsStreaming();
            hapticImpact(ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>
            {isStreaming ? "Stop Streaming" : "Start Streaming"}
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
