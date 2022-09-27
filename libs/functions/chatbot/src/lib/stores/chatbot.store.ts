import { Handler, HandlerTools } from '@iote/cqrs';

import { CursorStore } from './lib/cursor.store';
import { MessagesStore } from './lib/messages.store';
import { BlockConnectionsStore } from './lib/blocks-connections.store';
import { ChatInfoStore } from './lib/chat-info.store';
import { ChatStatusStore } from './lib/chat-status.store';

/**
 * Contains all the required database flow classes for the chatbot
 * Methods return a new instance of the class associated
 */
export class ChatBotStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) {
    this.tools = tools
  }

  /** Gets the methods for working with ChatInfo collection */
  chatInfo(){
    return new ChatInfoStore(this.tools)
  }

  /** Gets the methods for working with ChatStatus collection */
  chatStatus(){
    return new ChatStatusStore(this.tools)
  }

  /** Gets the methods for working with Cursor collection */
  cursor(){
    return new CursorStore(this.tools)
  }

  /** Gets the methods for working with Messages collection */
  messages(){
    return new MessagesStore(this.tools)
  }

  /** Gets the methods for working with Block and Connections collection */
  blockConnections(){
    return new BlockConnectionsStore(this.tools)
  }

}
