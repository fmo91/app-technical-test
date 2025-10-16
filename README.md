```
      ╔═════════════════════════════════════════════════════════════╗
      ║                      _____ _                                ║
      ║                     |_   _| |__   ___                       ║
      ║                       | | | '_ \ / _ \                      ║
      ║                       | | | | | |  __/                      ║
      ║                   _   |_| |_| |_|\___|  __ _          _     ║
      ║   _ __ ___   ___ | |__ (_) | ___       / _(_)_ __ ___| |_   ║
      ║  | '_ ` _ \ / _ \| '_ \| | |/ _ \ ___ | |_| | '__/ __| __|  ║
      ║  | | | | | | (_) | |_) | | |  __/|___||  _| | |  \__ \ |_   ║
      ║  |_| |_| |_|\___/|_.__/|_|_|\___|     |_| |_|_|  |___/\__|  ║
      ║          ___ ___  _ __ ___  _ __   __ _ _ __  _   _         ║
      ║         / __/ _ \| '_ ` _ \| '_ \ / _` | '_ \| | | |        ║
      ║        | (_| (_) | | | | | | |_) | (_| | | | | |_| |        ║
      ║         \___\___/|_| |_| |_| .__/ \__,_|_| |_|\__, |        ║
      ║                            |_|                |___/         ║
      ║                                                             ║
      ╚═════════════════════════════════════════════════════════════╝
```
# React Native Technical Test

# Part 1: Real-time Chat Interface with Dynamic Components

## Requirements

You need to build a real-time chat interface that displays a conversation between a user and an AI assistant. The conversation should be streamed and displayed progressively with smooth animations and transitions.

### Core Features

1. **Message Streaming**
   - Connect to a Server-Sent Events (SSE) stream that sends messages in real-time
   - Messages are streamed 4 characters by 4 characters with `text_chunk` events
   - Components are streamed field by field with `component_field` events
   - Parse and display messages progressively as they build up
   - Implement smooth animations and transitions for message appearance
   - Handle the complete conversation flow from start to finish

2. **Message Types**
   - **Text Messages**: Standard text content from both user and AI
   - **Component Messages**: Rich content with embedded components

3. **Dynamic Component System**
   - **Contact Badge Component**: Display contact information with profile picture
   - **Calendar Event Component**: Show meeting details with date, time, and status
   - **Extensible Design**: Components should be easily extensible for future types
   - **Clean UI**: Professional, responsive design that works on different screen sizes

### Technical Implementation

- Use React Native with TypeScript
- **Implement SSE client** - connect to Server-Sent Events stream at `https://api-dev.withallo.com/v1/demo/interview/conversation`
- **Character-level streaming** - handle `text_chunk` events to build messages progressively
- **Component field streaming** - handle `component_field` events to build components progressively
- **Message state management** - track message building state and component assembly
- **Component system** - create reusable components for different message types
- Ensure smooth performance during streaming
- Handle edge cases (network failures, malformed JSON, incomplete messages, etc.)
- **Error handling** - graceful handling of connection issues and parsing errors

### Sample Data Structure

**Note**: Here is an example of the data format:

```
event:message_start
data:{"event":"message_start","messageId":"msg_0","role":"user"}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"Hi! ","index":0}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"Can ","index":1}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"you ","index":2}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"help ","index":3}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"me ","index":4}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"schedule ","index":5}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"a ","index":6}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"meeting ","index":7}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"with ","index":8}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"John ","index":9}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"next ","index":10}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_0","chunk":"week?","index":11}

event:message_end
data:{"event":"message_end","messageId":"msg_0"}

event:message_start
data:{"event":"message_start","messageId":"msg_1","role":"agent"}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"Of ","index":0}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"course! ","index":1}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"I'd ","index":2}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"be ","index":3}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"happy ","index":4}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"to ","index":5}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"help ","index":6}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"you ","index":7}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"schedule ","index":8}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"a ","index":9}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"meeting ","index":10}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"with ","index":11}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"John. ","index":12}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"Let ","index":13}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"me ","index":14}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"check ","index":15}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"the ","index":16}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"available ","index":17}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"slots ","index":18}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"for ","index":19}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"next ","index":20}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_1","chunk":"week.","index":21}

event:message_end
data:{"event":"message_end","messageId":"msg_1"}

event:message_start
data:{"event":"message_start","messageId":"msg_2","role":"agent"}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"I ","index":0}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"found ","index":1}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"a ","index":2}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"good ","index":3}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"time ","index":4}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"slot ","index":5}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"for ","index":6}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"your ","index":7}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"meeting ","index":8}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"with ","index":9}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"John. ","index":10}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"Here's ","index":11}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"the ","index":12}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"proposed ","index":13}

event:text_chunk
data:{"event":"text_chunk","messageId":"msg_2","chunk":"event:","index":14}

event:component_start
data:{"event":"component_start","messageId":"msg_2","componentType":"calendar_event"}

event:component_field
data:{"event":"component_field","messageId":"msg_2","field":"title","value":"Meeting with John"}

event:component_field
data:{"event":"component_field","messageId":"msg_2","field":"date","value":"2025-10-22"}

event:component_field
data:{"event":"component_field","messageId":"msg_2","field":"time","value":"14:00"}

event:component_field
data:{"event":"component_field","messageId":"msg_2","field":"status","value":"PROPOSED"}

event:component_end
data:{"event":"component_end","messageId":"msg_2"}

event:message_end
data:{"event":"message_end","messageId":"msg_2"}
```

### Event Types

**Message Events**:
- `message_start`: Begins a new message with role and messageId
- `text_chunk`: Streams text content character by character with index
- `message_end`: Completes a message

**Component Events**:
- `component_start`: Begins a component with componentType
- `component_field`: Streams component fields one by one
- `component_end`: Completes a component

### Component Types

**Contact Badge Component**:
- `componentType`: "contact_badge"
- Fields: `name`, `email`, `company`, `profilePicture`

**Calendar Event Component**:
- `componentType`: "calendar_event"
- Fields: `title`, `date`, `time`, `status`

# Part 2: Product Strategy & Design Challenge

## The Challenge: Design the Next Evolution of Your Chat

After completing the basic chat interface, you now have a functional app that displays streaming messages and contact cards. But how can you make it more valuable and insightful for users?

**Your Mission**: Analyze the current implementation and design 2-3 strategic enhancements that would significantly improve user value and engagement. Focus on **why** these improvements matter, not just **what** to build.

## What We're Looking For

1. **Problem Analysis**: What specific user pain points or business opportunities did you identify? Why are these important?
2. **Strategic Thinking**: How did you prioritize which improvements to focus on? What trade-offs did you consider?
3. **Solution Design**: What would your ideal solution look like? How would users interact with it?
4. **Technical Feasibility**: What are the technical challenges and implementation considerations?
5. **Business Impact**: How would these improvements drive user engagement, retention, or other business metrics?

## Your Deliverable

**Write a comprehensive analysis** that covers:

- **Current State Assessment**: What works well in your Part 1 implementation? What are the limitations?
- **Opportunity Identification**: What 2-3 specific improvements would you prioritize and why?
- **Solution Design**: Describe your proposed enhancements in detail - user flows, UI concepts, technical approach
- **Justification**: Why these specific improvements over others? What evidence or reasoning supports your choices?
- **Implementation Roadmap**: How would you approach building these features? What are the technical challenges?

## Optional: Proof of Concept

If you want to demonstrate your ideas, you can implement a simple prototype of one feature.

## Evaluation Criteria

- **Technical Depth**: Understanding of React Native, mobile development patterns, and best practices
- **Design Quality**: Clean, intuitive UI with smooth animations and professional appearance
- **Code Quality**: Well-structured, maintainable code
- **Problem-Solving**: Clear thinking process and well-reasoned solutions

# Getting Started

1. Fork this repository on your own GitHub account
2. Implement the streaming chat interface with dynamic contact cards
3. Complete the problem-solving challenge
4. Document your approach and decisions
5. Send us the URL to your forked repository with clear instructions for running the app

Good luck! We're excited to see your solution and thought process.
