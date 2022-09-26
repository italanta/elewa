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

  chatInfo(){
    return new ChatInfoStore(this.tools)
  }

  chatStatus(){
    return new ChatStatusStore(this.tools)
  }

  cursor(){
    return new CursorStore(this.tools)
  }

  messages(){
    return new MessagesStore(this.tools)
  }

  blockConnections(){
    return new BlockConnectionsStore(this.tools)
  }

}
