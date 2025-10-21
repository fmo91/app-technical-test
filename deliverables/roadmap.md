# Roadmap

In this document, I will describe some of the possible enhancements that can be implemented to the project. 

A word of caution here, as I don't know the user personas in detail. I'll assume motivations, and personal traits.

## Strategic enhancement 1: Smart reply suggestions

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

### Proposed technical implementation

## Strategic enhancement 2: Conversation anchors

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
