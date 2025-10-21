import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function StreamingText({ chunks, messageId, testID }: { chunks: string[]; messageId: string, testID?: string }) {
  if (chunks.length === 0) {
	return null;
  }

  return (
	<View style={styles.messageInline} testID={testID}>
	  {chunks.map((chunk, index) => (
		<AnimatedChunk key={`${messageId}-chunk-${index}`} text={chunk} />
	  ))}
	</View>
  );
}

function AnimatedChunk({ text }: { text: string }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(4);

  React.useEffect(() => {
	opacity.value = 0;
	translateY.value = 4;
	opacity.value = withTiming(1, {
	  duration: 240,
	  easing: Easing.out(Easing.cubic),
	});
	translateY.value = withTiming(0, {
	  duration: 240,
	  easing: Easing.out(Easing.cubic),
	});
  }, [opacity, translateY, text]);

  const animatedStyle = useAnimatedStyle(() => ({
	opacity: opacity.value,
	transform: [{ translateY: translateY.value }],
  }));

  return (
	<Animated.Text style={[styles.message, animatedStyle]}>
	  {text}
	</Animated.Text>
  );
}

const styles = StyleSheet.create({
  message: {
	fontSize: 15,
	color: '#1a1a1a',
	lineHeight: 20,
  },
  messageInline: {
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginBottom: 8,
  },
})