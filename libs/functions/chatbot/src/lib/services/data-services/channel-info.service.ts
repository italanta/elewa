import { HandlerTools } from '@iote/cqrs';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { BotDataService } from './data-service-abstract.class';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';

/**
 * Contains all the required database flow methods for the ChatInfo collection
 */
export class ChannelDataService extends BotDataService<BaseChannel> {
  private _docPath: string;
  private _msg: BaseMessage;
  
  constructor(tools: HandlerTools) 
  {
    super(tools)
  }

  protected _init(msg: BaseMessage){
    this._docPath = `channels/${msg.platform}/${msg.storyId}/${msg.phoneNumber}`
    this._msg = msg
  }


  async getChannelInfo(phoneNumber: string): Promise<ChatInfo> {
    // Get users
    const channelInfo =  await this.getDocumentById(phoneNumber, this._docPath)

    if (!channelInfo) {
      throw new Error('The user has not been registered to a channel');
    }
    return channelInfo;
  }
  
}
