# Description

To allow users to render their stories as (WhatsApp) bots, we needed to develop a backend infrastructure which can take the input of the user i.e. the bot scenario, and render it as a chat conversation. 

## 1.0 Feature Overview

The below are the main features implemented:

### 1.1 Core bot engine
- The underlying part of  the engine that receives the message, processes it and formulates a response (if applicable).
- Thanks to the [decorator pattern](https://refactoring.guru/design-patterns/decorator) the engine does not need to know where the message is coming from.

### 1.2 Whatsapp Channel integration
- We have included a whatsapp receive message handler that is triggered by a messages [webhook](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks) on whatsapp
- The intergration includes a function to **send a message** over the whatsapp api to the end user.
- Interpretation of messages happens here

### 1.3 Interpretation of Incoming Messages
- We receive different types of messages e.g. text, image, location from different platforms e.g. whatsapp, telegram etc. So we **convert** these different messages into a standardized format that our bot engine can understand.
- The standardized message is then passed to the bot engine
- Implements the [Template Method](https://refactoring.guru/design-patterns/template-method) to define the structure that must be followed by the channel e.g. whatsapp when interpreting incoming messages

### 1.4 Interpretation of Outgoing Messages
- When the engine finds the next block to send back to the user we convert this block into a format that can be sent over the specific platform(whatsapp, telegram) api.
- Implements the [Template Method](https://refactoring.guru/design-patterns/template-method) to define the structure that must be followed by the channel e.g. whatsapp when interpreting outgoing messages

### 1.5 Adding a story to a Channel
- After a story is saved and ready to be consumed by the end user, we need to add it to a channel.  A channel represents a connection from our **platform** to a third-party platform e.g. whatsapp. 
- It enables the end user to communicate with the chatbot.
- A channel also helps us link end user messages to a story.

### 1.6 Adding the Anchor Block Component to the story editor frame

- When a user send the first message to out chatbot, we cannot really know the first block to send them since what is being saved is just blocks and connections.
- Therefore we need a block that will act as the first block in the story and help us save the  connection to the first block.
- So the Anchor Block @Component {AnchorBlockComponent} is a static component that is automatically added to the story editor new story is created. It is the 'anchor' point to the rest of the story.

## 2.0 TODO:
- Add more interpretations of incoming and outgoing messages
- Provide more details e.g. code references in the documentation
- Create a Dependency Injection Container to manage and inject all the dependencies across the bot-engine
