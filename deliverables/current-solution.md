# Current solution: Technical notes

This repository contains what I could achieve in a few days of thinking on the problem, taking technical decisions and crafting code. In this document, I aim to summarize the most important points of the current solution, and introduce you to my thought process, and the most important decisions I have taken so far. I'm honestly not completely proud of what I have achieved, but I believe there are some interesting discussions we could have based on my thought process and the tradeoffs I have taken.

## An overview

The app is built with minimal external dependencies, apart from the ones that the Expo starting project comes with:

* [Redux](https://redux.js.org/): A popular unidirectional architecture library, widely used in React projects (although there are too many alternatives nowadays.
* [Redux Toolkit](https://redux-toolkit.js.org/): A set of opinionated tools to implement Redux with minimal boilerplate.
* [React Native SSE](https://github.com/binaryminds/react-native-sse): From their Github README.md "*Event Source implementation for React Native. Server-Sent Events (SSE) for iOS and Android 🚀*".

## Interesting technical challenges and decisions

### Compose messages from SSE events

I've made too many changes on this one, as you can see in the Git history. SSE events come from the server with a type and a payload, very similar to how Redux actions are built. I needed to get these events as they were coming and compose the messages, transitioning from state to state until the messages were formed. At the same time, I wanted to implement a solution that felt natural, reducing as much as possible the cognitive load for someone external who was reading the code.

My strategy was as follows:

1. Start framework agnostic. Identify the problem and its constraints, and attempt a solution to the messages composition, completely abstracted of networking matters, or UI. Try to reduce the problem to a known problem I have already solved in the past.
2. Implement the simplest possible solution to the problem I have identified. Attempt to solutionize with a pure function which can be unit tested in isolation, with a known set of inputs/outputs.
3. Fit the solution into the overall system architecture, so that it doesn't seem strange compared to the rest of the project.

First, I started with the problem identification, for which I decided it was very similar to a [Finite State Machine (FSM)](https://en.wikipedia.org/wiki/Finite-state_machine). We had some known states:

- `idle`: The FSM initial state. We are awaiting for events to come.
- `building_message_text`: We have received a `message_start` event while the FSM was `idle`, so now we are awaiting for `text_chunk` or `component_start` events.
- `building_message_component`: We have received `component_start` while we were in `building_message_text` state. We are now awaiting for `component_field` or `component_end` events.
- `finished_building_message_component`: We have received `component_end`. Usually, we are awaiting for `finished_building_message`, but nothing prevent us from getting other kinds of events, such as more text. 
- `finished_building_message`: We have received `message_end`. The message is now complete.

Why a FSM?

- We have a set of known states.
- We have clearly defined transitions between states.
- The tokens which trigger the transitions are the events that come from the server.
- It should be simple to invalidate transitions when they are not appropriate.

Second, I implemented the simplest possible solution, as I mentioned above. The simplest solution I've found was to create a pure function called [`handleMessageReceived`](https://github.com/themobilefirstco/app-technical-test/blob/bfd59beadc1c9e4b74c19adc986652879d1fcd3c/utils/chat/handleMessageReceived.ts). The signature for the function was as follows:

```typescript
export function handleMessageReceived(currentState: State, message: { event: string, data: object }): State
```

The `State` definition was:

```typescript
export type State = 
  | Idle 
  | BuildingMessageText 
  | BuildingMessageComponent 
  | FinishedBuildingMessageComponent 
  | FinishedBuildingMessage;
```

Each of those states were described above. You can find the implementation details [here](https://github.com/themobilefirstco/app-technical-test/blob/bfd59beadc1c9e4b74c19adc986652879d1fcd3c/utils/chat/handleMessageReceived.ts).

This function is pure, as the outputs are only dependant on the inputs received, and can be easily [tested](https://github.com/themobilefirstco/app-technical-test/blob/bfd59beadc1c9e4b74c19adc986652879d1fcd3c/utils/chat/handleMessageReceived.test.ts). Working on this function was ideal, as I could try different solutions, while reducing the feedback loop to its fastest expression.

The problem with `handleMessageReceived` is that it didn't hold the messages we have received so far. It isn't enough to keep the Chat state. In order to do this, I created another simple component, called [`Chat`](https://github.com/themobilefirstco/app-technical-test/blob/03842820924c84f8e2c89e478bb689cb3155cb64/utils/chat/chat.ts), which was a simple state holder, using `handleMessageReceived` for processing the incoming events, and collecting the messages as they were being formed.

Once I was happy with this, I moved to the final step: **integrating into something more natural for the rest of the app**. As I will describe later, I decided to use [Redux Toolkit](https://redux-toolkit.js.org/) for managing the app state. What I did was to:

1. Embed the chat state into the overall application state.
2. Add an action creation for each SSE event. Dispatch actions as the events came.
3. In the reducer for the Chat slice, handle the SSE events and evolve the state as needed.

Basically, I moved the logic from `handleMessageReceived` to the reducer, and the `Chat` state to the `Store` state.

This worked well for me in my tests and looked much more natural.

### Composing custom components from SSE events

### Managing State

On this one, I also tried three different solutions. I'm conscious that maybe this is due to my last few experiences being in native Swift/SwiftUI instead of React/React Native. I didn't have a favorite tool or pattern I wanted to use. In my previous experiences, I've implemented Redux (without Redux Toolkit), and also just State/Context.

I wanted to choose something that let me:

1. Model naturally the SSE events and the Finite State Machine which created the messages.
2. Write minimal boilerplate. This is a demo app, although this is generally a good tradeoff. The solution should be as simple as possible to reduce cognitive load.
3. Not pollute the UI components. I wanted to keep presentational UI components as focused to the presentation as possible.

I tried some things before deciding on the final solution:
1. I started installing [Zustand](https://zustand-demo.pmnd.rs/), but it didn't resemble the FSM design I wanted for the project.
2. I then removed Zustand from the project and tried just hooks, with a [`useChatConnection`](https://github.com/themobilefirstco/app-technical-test/blob/03842820924c84f8e2c89e478bb689cb3155cb64/utils/chat/useChatConnection.ts) hook which was responsible for keeping track of the messages incoming and returned the messages for the UI to display. This was great for the UI, but it used `Chat` and `handleMessageReceived` under the hood, which weren't idiomatic enough for me. Another drawback I noticed was that the state was not very easy to inspect. I wanted to prioritize actions/state inspection for debugging.

I finally did this:

1. Implement Redux, with the technical details you can read on the previous section. 
2. There is a single Redux slice, called [`chatSlice.ts`](https://github.com/fmo91/app-technical-test/blob/main/redux/features/chatSlice.ts).
3. There is a [container component](https://github.com/fmo91/app-technical-test/blob/main/app/index.tsx), which sets the SSE connection up.
4. There are presentational components, starting from [`ChatScreenContent`](https://github.com/fmo91/app-technical-test/blob/main/app/ChatScreenContent.tsx), and following with other [smaller components](https://github.com/fmo91/app-technical-test/tree/main/components). These are only concerned of the visual aspect of the app.

A big advantage of using Redux is that I can now inspect the state using [Reactotron](https://docs.infinite.red/reactotron/).

### AI/LLM usage for development

## Shortcomings

Unfortunately, this solution still has several shortcomings I'm not happy with. Things I didn't handle so far:

1. **Offline scenarios**: When the connection is lost and we recover it later, the SSE stream ends, and can't be resumed.
2. **Some invalid transitions between states**: One of the biggest strengths of the original FSM is that we can reject invalid transitions. I haven't made use of that advantage so far. This should be something doable, but I haven't spent the time needed to implement it.
3. **Cross cutting concerns such as tracking**: For this one, I wanted to showcase a middleware which observed certain actions and fired tracking events.
