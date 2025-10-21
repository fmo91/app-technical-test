import React from "react";
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ChatScreen from "./index";
import EventSource from "react-native-sse";
import chatReducer from "../redux/features/chatSlice";

jest.mock("../ReactotronConfig", () => ({
	__esModule: true,
	default: {
		createEnhancer: () => (next: unknown) => next,
	},
}));

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	}),
}));

jest.mock("../utils/haptics", () => ({
	__esModule: true,
	hapticImpact: jest.fn(),
	hapticSelection: jest.fn(),
	hapticNotification: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
	__esModule: true,
	ImpactFeedbackStyle: { Light: "light" },
	impactAsync: jest.fn(),
	notificationAsync: jest.fn(),
	selectionAsync: jest.fn(),
}));

type Listener = (event: MessageEvent<string>) => void;

let mockLatestEventSource:
	| {
			open: jest.Mock;
			close: jest.Mock;
			addEventListener: jest.Mock;
			removeAllEventListeners: jest.Mock;
			emit: (eventName: string, data: unknown) => void;
	  }
	| undefined;

jest.mock("react-native-sse", () => {
	const createListenerStore = () => {
		const listeners: Record<string, Listener[]> = {};

		return {
			register(eventName: string, handler: Listener) {
				if (!listeners[eventName]) {
					listeners[eventName] = [];
				}
				listeners[eventName].push(handler);
			},
			clear() {
				Object.keys(listeners).forEach((key) => {
					delete listeners[key];
				});
			},
			emit(eventName: string, eventData: unknown) {
				(listeners[eventName] ?? []).forEach((handler) =>
					handler({
						type: eventName,
						data:
							eventData === undefined
								? undefined
								: JSON.stringify(eventData),
					} as MessageEvent<string>),
				);
			},
		};
	};

	return jest.fn().mockImplementation(() => {
		const listenerStore = createListenerStore();

		mockLatestEventSource = {
			open: jest.fn(),
			close: jest.fn(),
			addEventListener: jest
				.fn()
				.mockImplementation((eventName: string, handler: Listener) => {
					listenerStore.register(eventName, handler);
				}),
			removeAllEventListeners: jest.fn().mockImplementation(() => {
				listenerStore.clear();
			}),
			emit: (eventName: string, data: unknown) => {
				listenerStore.emit(eventName, data);
			},
		};

		return mockLatestEventSource;
	});
});

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
	runAfterInteractions: (callback: () => void) => {
		callback?.();
		return {
			then: () => {},
			done: () => {},
			cancel: () => {},
		};
	},
}));

const mockedEventSource = EventSource as unknown as jest.Mock;

const createTestStore = () =>
	configureStore({
		reducer: { chat: chatReducer },
	});

const renderWithStore = (store = createTestStore()) =>
	render(
		<Provider store={store}>
			<ChatScreen />
		</Provider>,
	);

const startStreamingThroughUI = async () => {
	const toggleLabel = await screen.findByText("Start Streaming");
	fireEvent(toggleLabel, "pressIn");
	await waitFor(() => expect(mockLatestEventSource?.open).toHaveBeenCalled());
	return mockLatestEventSource!;
};

const emitEvent = async (eventName: string, payload: unknown) => {
	await act(async () => {
		mockLatestEventSource?.emit(eventName, payload);
	});
};

describe("ChatScreen integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLatestEventSource = undefined;
	});

	test("streams agent text messages into the UI", async () => {
		const store = createTestStore();
		renderWithStore(store);

		await waitFor(() => expect(mockLatestEventSource).toBeDefined());
		const eventSource = await startStreamingThroughUI();

		expect(mockedEventSource).toHaveBeenCalledWith(
			"https://api-dev.withallo.com/v1/demo/interview/conversation",
		);

		await emitEvent("message_start", {
			role: "agent",
			messageId: "msg_1",
		});
		await emitEvent("text_chunk", { chunk: "Hello" });
		await emitEvent("text_chunk", { chunk: " there!" });
		await emitEvent("message_end", undefined);

		const messagesList = await screen.findByTestId("messages-list");
		expect(messagesList).toBeTruthy();
		expect(await screen.findByTestId("msg_1-agent-row")).toBeTruthy();
		expect(screen.getByText("Hello")).toBeTruthy();
		expect(screen.getByText("there!")).toBeTruthy();

		expect(eventSource.open).toHaveBeenCalledTimes(1);
		expect(screen.getByText("Stop Streaming")).toBeTruthy();
	});

	test("renders structured agent components from SSE events", async () => {
		const store = createTestStore();
		renderWithStore(store);

		await waitFor(() => expect(mockLatestEventSource).toBeDefined());
		await startStreamingThroughUI();

		await emitEvent("message_start", {
			role: "agent",
			messageId: "msg_calendar",
		});
		await emitEvent("text_chunk", { chunk: "Upcoming" });
		await emitEvent("text_chunk", { chunk: " event:" });
		await emitEvent("component_start", { componentType: "calendar_event" });
		await emitEvent("component_field", {
			field: "title",
			value: "Team Sync",
		});
		await emitEvent("component_field", {
			field: "date",
			value: "2025-02-18",
		});
		await emitEvent("component_field", { field: "time", value: "09:30" });
		await emitEvent("component_field", {
			field: "status",
			value: "PROPOSED",
		});
		await emitEvent("component_end", undefined);

		const agentRow = await screen.findByTestId("msg_calendar-agent-row");
		expect(agentRow).toBeTruthy();

		expect(screen.getByText("Upcoming")).toBeTruthy();
		expect(screen.getByText("event:")).toBeTruthy();

		const calendarCard = await screen.findByTestId(
			"msg_calendar-calendar-event",
		);
		expect(calendarCard).toBeTruthy();
		expect(screen.getByText("Team Sync")).toBeTruthy();
		expect(screen.getByText("2025-02-18")).toBeTruthy();
		expect(screen.getByText("09:30")).toBeTruthy();
		expect(screen.getByText("PROPOSED")).toBeTruthy();
	});
});
