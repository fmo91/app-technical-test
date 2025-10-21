jest.mock("react-native-reanimated", () => {
	const React = require("react");
	const { Text } = require("react-native");
	const NOOP = () => {};
	const Animated = {
		Text: (props: any) => React.createElement(Text, props),
	};

	return {
		__esModule: true,
		default: Animated,
		Easing: {
			out: (fn: (value: number) => number) => fn,
			cubic: (value: number) => value,
		},
		useSharedValue: (initial: unknown) => ({ value: initial }),
		useAnimatedStyle: () => () => ({}),
		withTiming: (value: unknown) => value,
		runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
		runOnUI: (fn: (...args: unknown[]) => unknown) => fn,
		cancelAnimation: NOOP,
		interpolate: () => 0,
	};
});
