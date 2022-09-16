import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { Chat, ChatFlowStatus, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { RawMessageWrapper, RawMessage, ChatMessage } from '@app/model/convs-mgr/conversations/messages';
import { createMessage } from '../model/create-message.model';

/** Cache across function invocations. */
const __KnownChats: string[] = [];

export class RecordMessageHandler extends FunctionHandler<RawMessageWrapper, RestResult200>
{
  /**
   * Incoming message hook from Landbot.
   *
   * Registers incoming messages and processes them as readable information in our system.
   */
  public async execute(req: RawMessageWrapper, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[RecordMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));

    await Promise.all(req.messages.map(msg => this._processMessage(msg, tools)));

    return { success: true } as RestResult200;
  }

  private async _processMessage(msg: RawMessage, tools: HandlerTools)
  {
    tools.Logger.log(() => `[RecordMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    /** Always link the chatId to the customer, as multiple senders are involved in a chat. */
    const chatId = `${msg.customer.id}`;

    if(!__KnownChats.find(c => c === chatId))
      await this._initSession(chatId, msg, tools);

    const messageRepo = tools.getRepository<ChatMessage>(`sessions/${chatId}/messages`);
    const message = createMessage(msg);

    await this._updateChat(chatId, message, tools);

    return messageRepo.create(message);
  }

  /** If a chat session has not yet been recorded on this container, we need to verify if the chat exists.
   *    Therefore,
  */
  private async _initSession(chatId: string, msg: RawMessage, tools: HandlerTools)
  {
    const chatRepo = tools.getRepository<Chat>(`sessions`);
    const chat = await chatRepo.getDocumentById(chatId);

    if(chat)
      __KnownChats.push(chat.id);
    else {
      const nChat: Chat = {
        id: chatId,
        name: msg.customer.name,
        phone: msg.customer.phone,
        flow: ChatFlowStatus.Flowing,
        onboardedOn: new Date(),

        status: ChatStatus.New,
        channel: msg.channel.type,
        channelId: `${msg.channel.id}`,
        channelName: msg.channel.name,
        updatedOn: new Date()
      };

      await chatRepo.create(nChat, chatId);
      __KnownChats.push(chat.id);
    }
  }

  private async _updateChat(chatId: string, message: ChatMessage, tools: HandlerTools)
  {
    let chatIsChanged = false;

    const chatRepo = tools.getRepository<Chat>('sessions');
    const chat = await chatRepo.getDocumentById(chatId);

    if(message.origin === 'agent' && chat.awaitingResponse)
    {
      chat.awaitingResponse = false;
      chatIsChanged = true;
    }
    else if(message.origin === 'customer')
    {
      if(chat.flow === ChatFlowStatus.Paused || chat.flow === ChatFlowStatus.PausedByAgent
          || chat.flow === ChatFlowStatus.Completed)
      {
        chat.awaitingResponse = true;
        chatIsChanged = true;
      }
      else if(chat.status === ChatStatus.Stashed || chat.flow === ChatFlowStatus.Stashed)
      {
        chat.status = ChatStatus.New;
        chat.flow = ChatFlowStatus.PausedByAgent;
        chat.stashed = {reason: '', stashedBy: ''};
        chatIsChanged = true;
      }
    }

    if(chatIsChanged)
    {
      await chatRepo.update(chat);
    }
  }

}
