import { __DateFromStorage } from '@iote/time';

import { AddMessageFactory } from '@app/functions/conversations/messages/add-message';

import { MessagesDataService } from './data-services/messages.service';
import { ChatStatusDataService } from './data-services/chat-status.service';
import { ChannelDataService } from './data-services/channel-info.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, ChatStatus, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { WhatsappChannel } from '@app/model/bot/channel';
import { ProcessMessageService } from './process-message/process-message.service';
import { HandlerTools } from '@iote/cqrs';
import { Block } from '@app/model/convs-mgr/conversations/chats';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { SendMessageFactory } from '@app/functions/messages/whatsapp';
import { ChatBotMainService } from './main-chatbot.service';

/**
 * Handles the main processes of the ChatBot
 */
export class ChatManagerService {
  platform: Platforms;
  messageChannel: WhatsappChannel;
  chatId: string;

  constructor(
    private _msgDataService$: MessagesDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _channelService$: ChannelDataService,
    private _blocksService$: BlockDataService,
    private _connService$: ConnectionsDataService,
    private _cursorDataService$: CursorDataService,
    private _tools: HandlerTools,
    platform: Platforms
  ) {
    this.platform = platform;
  }

  async main(rawMessage: RawMessageData){

    const currentChat  = await this._chatStatusService$.getChatStatus(storyId)

    const chat = new ChatBotMainService()

    switch (currentChat.status) {
      case ChatStatus.Running:
        
        break;
      case ChatStatus.Paused:
        
        break;      
      case ChatStatus.TakingToOperator:
        
        break;
      default:
        break;
    }
  }

  async init(rawMessage: RawMessageData){

  }
}
