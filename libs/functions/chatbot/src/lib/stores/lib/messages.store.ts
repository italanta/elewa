import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Message, RawMessageData } from '@app/model/convs-mgr/conversations/messages';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class MessagesStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    this.tools = tools;
  }

  async saveMessage(msg: RawMessageData) {
    const timeStamp = Date.now();

    const messageRepo$ = this.tools.getRepository<Message>(`end-users/${msg.phoneNumber}/platforms/${msg.platform}/messages`);

    const savedMessage = await messageRepo$.create(msg, timeStamp.toString());

    return savedMessage;
  }

  async getLatestMessage(msg: Message): Promise<Message> {
    const messageRepo$ = this.tools.getRepository<Message>(`end-users/${msg.phoneNumber}/platforms/${msg.platform}/messages`);

    const latestMessage = await messageRepo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));

    return latestMessage[0];
  }
}
