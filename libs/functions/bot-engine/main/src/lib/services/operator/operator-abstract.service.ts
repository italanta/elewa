import { HandlerTools } from '@iote/cqrs';

import { CursorDataService } from '../data-services/cursor.service';
import { ChatStatusDataService } from '../data-services/chat-status.service';

import { SendMessageFactory } from '@app/functions/messages/whatsapp';

import { StoryBlock } from '@app/model/bot/blocks/story-block';
import { BaseChannel } from '@app/model/bot/channel';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, ChatStatus } from '@app/model/convs-mgr/conversations/messages';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';


export abstract class OperatorService {
  abstract platform: Platforms;

  constructor(
    private _cursorDataService$: CursorDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _tools: HandlerTools
  ) {}

  abstract generateLink(phoneNumber: string): string;

  async takeUserToBlock(block: StoryBlock) {
    await this._cursorDataService$.updateCursor(block);
  }

  async pauseChat(msg: BaseMessage) {
    this._chatStatusService$.updateChatStatus(msg, ChatStatus.Paused);
  }

  async resumeChat(msg: BaseMessage) {
    this._chatStatusService$.updateChatStatus(msg, ChatStatus.Running);
  }

  async sendOperatorChatLink(channel: BaseChannel, operatorPhoneNumber: string, endUserPhoneNumber: string) {
    // Get the link
    const link = this.generateLink(operatorPhoneNumber);

    // Generate message
    const msg: BaseMessage = {
      message: link,
      phoneNumber: endUserPhoneNumber,
      channelName: this.platform,
      ...channel,
    };

    // Set the chat status
    this._chatStatusService$.updateChatStatus(msg, ChatStatus.TakingToOperator);

    // Send the url as message to user
    if (this.platform) {
      const client = new SendMessageFactory(msg.platform, this._tools).resolvePlatform();

      await client.sendMessage(msg, msg.phoneNumber, StoryBlockTypes.TextMessage);
    } else {
      throw new Error('Platform not provided');
    }
  }
}
