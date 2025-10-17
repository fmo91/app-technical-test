import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserMessageRow({ item }: { item: any }) {
  return (
	<View style={styles.container}>
	  <View style={styles.bubble}>
		<Text style={styles.message}>{item.content.text}</Text>
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
  message: {
	fontSize: 15,
	color: '#1a1a1a',
  },
});
