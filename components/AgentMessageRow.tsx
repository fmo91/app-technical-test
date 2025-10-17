import React from 'react';
import { View, Text } from 'react-native';

export default function AgentMessageRow({ item }: { item: any }) {
  return (
	<View style={{ padding: 16 }}>
	  <Text>{item.content.text}</Text>
	</View>
  );
}
