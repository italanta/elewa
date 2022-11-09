import { HandlerTools } from '@iote/cqrs';

import { CursorDataService } from '../data-services/cursor.service';
import { ChatStatusDataService } from '../data-services/end-user.service';

import { SendMessageFactory } from '@app/functions/messages/whatsapp';

import { StoryBlock } from '@app/model/bot/blocks/story-block';
import { CommunicationChannel } from '@app/model/bot/channel';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { Message, ChatStatus } from '@app/model/convs-mgr/conversations/messages';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';


export abstract class OperatorService {
  abstract platform: PlatformType;

  constructor(
    private _cursorDataService$: CursorDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _tools: HandlerTools
  ) {}

  abstract generateLink(phoneNumber: string): string;

  async takeUserToBlock(block: StoryBlock) {
    await this._cursorDataService$.updateCursor(block);
  }

  async pauseChat(msg: Message) {
    this._chatStatusService$.updateChatStatus(msg, ChatStatus.Paused);
  }

  async resumeChat(msg: Message) {
    this._chatStatusService$.updateChatStatus(msg, ChatStatus.Running);
  }

  async sendOperatorChatLink(channel: CommunicationChannel, operatorPhoneNumber: string, endUserPhoneNumber: string) {
    // Get the link
    const link = this.generateLink(operatorPhoneNumber);

    // Generate message
    const msg: Message = {
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
