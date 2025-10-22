# Roadmap

In this document, I will describe some of the possible enhancements that can be implemented to the project. 

A word of caution here, as I don't know the user personas in detail. I'll assume motivations, and personal traits.

## Strategic enhancement 1: Offline support

### Motivation

> Users need to read the conversations even when they have no internet connection, and be able to queue messages for when they have their internet connection back.

### Motivation

There are some features users generally expect from a premium-grade mobile app. Offline access is one of the features a user expects to have on a good mobile app. Otherwise, there aren't too many things that distinguishes it from a web app.

By providing optimistic updates, a persistent storage for conversations, and general access to their data without internet connection, we would be able to provide users with a much more polished and less frustrating experience.

### Success metrics

- User session length increases for users that open the app without internet connection

### Key assumptions

- Users use the app when they don't have internet connection, and that happens frequently
- A user pain point is that users want to send messages in the subway, or in other places when they don't have internet connection, and they usually get frustrated when they can't do it.

### Proposed solution (product wise)

The key points to understand the feature impact in this app are:

- When a user opens the app without internet connection, all their conversations, appointments scheduled, contacts, and important data are available for reading.
- When a user loses internet connection while they are in the middle of a conversation, they keep receiving messages when the internet connection is recovered. No message is lost.
- When a user loses internet connection while they are in the middle of a conversation, the messages they send are queued and sent once the internet connection is restablished. 
- When a user opens a conversation when they don't have internet connection, they are capable of sending messages, which are then marked as `pending`, and sent once the internet connection is restablished.

### Proposed technical implemnetation

In order to implement this feature, I believe we don't need to involve a change in the server side. All changes will be implemented in the client side.

We would need to implement a few key components for the solution:

- **A database or persistent storage**: [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/) is probably the dependency I'd suggest using, as we are using the Expo ecosystem already. In any case, this component will be responsible for persisting all the conversations and useful data pieces we want to make available for offline.
- **A service for data loading**: We want to abstract from where the data is obtained. In other platforms, such as native iOS or Android, we would use something similar to [Repositories](https://developer.android.com/topic/architecture/data-layer) or data access services. In any case, this layer would abstract the data access operations from the underlying stores or network requests. In React Native, the implementation will be different, but the underlying principles should be respected.
- **A service for scheduling mutations**: In the same way as with the data loading abstraction, we would need to have a component that abstracts the message sending from the underlying offline queuing mechanisms, and exposes a simplified (but flexible enough) interface.

Both the service for data loading and the service for scheduling mutations should be dependent on the persistent storage. The persistnet storage shouldn't be accessed directly from arbitrary locations in the database.

The implementation details must be decided, as the current project doesn't even have the ability for sending messages. We are just listening to events in a remote stream, but are not able to send messages to the server yet.

## Strategic enhancement 2: Smart reply suggestions

> Text based interfaces often suffer from discoverability issues. Having suggestions for the replies as a discrete sets of options (to pre-populate the prompt) is possibly a way to solutionize this.

### Motivation

In text based interfaces, discoverability is a problem. Free form input means that users can ask whatever they want or need, but the agent doesn't know how to fulfill a user request, or the user may not know that the agent is capable of doing something. 

### Success metrics

We want to impact the user in the following ways:
1. component usage should increase

### Key assumptions

1. Some components are getting low usage metrics
2. Users find themselves ending conversations without their purposes being fulfilled

### Proposed solution (product wise)

* With each agent reply, we will optionally display a list of suggestions above the user text input component.
* This is optional, as mentioned, and will depend on the type of agent message.

Let's see an example:

- **User**: Could you give me 

### Proposed technical implementation

## Strategic enhancement 3: Conversation anchors

> Sometimes, the context the agent has is not clear. Also, we must build a clear context for the user. What appointments has the agent made so far? What are the main points of the conversation? We can add anchors to some key parts of the conversation so that it's easier to navigate the conversation once it has gotten longer.

### Motivation

Another problem I usually see with text based UIs is that the context can be easy to miss or forget. "What are the most important bits of information that the agent have given to me so far?" This is a question I usually don't know how to answer and I find myself asking the question to the agent "can you summarize what we have talked so far?". 

I propose adding anchors to the key parts of the conversation, and then display a log containing them in some part of the UI.

### Key assumptions

1. Users ask the same questions several times during the same conversation
2. Users scroll a lot in order to reach to some parts of the conversation they might frequently need

### Success metrics

We want to impact the user in the following ways:
1. summarization or context questions should be reduced

### Proposed solution (product wise)

### Proposed technical implementation
