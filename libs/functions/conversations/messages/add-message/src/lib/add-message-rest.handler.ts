import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { Message, RawMessageData } from '@app/model/convs-mgr/conversations/messages';

import { ChatBotStore } from '@app/functions/chatbot';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseChannel } from 'libs/model/bot/channel/src';
import { Query } from '@ngfi/firestore-qbuilder';

export class AddMessageHandler extends FunctionHandler<RawMessageData, RestResult200> {
  platform: Platforms;
  /**
   * Registers incoming messages in the messages collection which triggers the processMessage handler
   */
  public async execute(req: RawMessageData, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AddMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));
    const chatBotRepo$ = new ChatBotStore(tools);

    this.platform = this._getPlatform(req) || Platforms.WhatsApp;

    // Check if the enduser is registered to a channel
    const messageChannel = await this._getChannels(req, tools);

    if (messageChannel) {
      // Add message to collection
      await this._addMessage(req, messageChannel, chatBotRepo$);
    } else {
      // Initialize chat status
      await this._init(messageChannel, tools);

      // Add message to collection
      await this._addMessage(req, messageChannel, chatBotRepo$);
    }

    return { success: true } as RestResult200;
  }

  /**
   * Adds the new message to the collection with the timestamp as the id
   */
  private async _addMessage(msg: RawMessageData, channel: BaseChannel, chatBotRepo$: ChatBotStore): Promise<Message> {

    // Construct the message object
    const newMessage: Message = {
      channelId: channel.businessPhoneNumber,
      storyId: channel.storyId,
      orgId: channel.orgId,
      phoneNumber: msg.phoneNumber,
      message: msg.message,
      platform: this.platform,
    };

    const savedMessage = await chatBotRepo$.messages().saveMessage(newMessage);

    return savedMessage;
  }

  private async _init(channel: BaseChannel, tools: HandlerTools) {
    const chatStatus = new ChatBotStore(tools).chatStatus();

    /** Initialize Chat Status */
    const chatData = await chatStatus.initChatStatus(channel, this.platform);

    return chatData;
  }

  private async _getChannels(msg: RawMessageData, tools: HandlerTools) {
    const channelRepo$ = tools.getRepository<BaseChannel>(`channels/${this.platform}/${msg.phoneNumber}/`);

    const channels = await channelRepo$.getDocuments(new Query());

    return channels[0];
  }

  private _getPlatform(msg: RawMessageData): Platforms {
    // [Work In Progress]
    // TODO: Implement a way of resolving the platform from the incoming message data

    return null;
  }
}
