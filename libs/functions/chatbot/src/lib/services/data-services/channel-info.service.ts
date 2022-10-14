import { HandlerTools } from '@iote/cqrs';

// import { BaseChannel } from '@app/model/bot/channel';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { BotDataService } from './data-service-abstract.class';
import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel } from 'libs/model/bot/channel/src';

/**
 * Contains all the required database flow methods for the ChatInfo collection
 */
export class ChannelDataService extends BotDataService<BaseChannel> {
  private _docPath: string;
  private _msg: RawMessageData;
  
  constructor(msg: RawMessageData,tools: HandlerTools) 
  {
    super(tools)
    this._init(msg)
  }

  protected _init(msg: RawMessageData){
    this._docPath = `channels/${msg.platform}/${msg.botAccountphoneNumberId}`
    this._msg = msg
  }


  async getChannelInfo<T>(phoneNumber: string): Promise<T> {
    // Get users
    const channelInfo =  (await this.getDocumentById(phoneNumber, this._docPath)) as T

    if (!channelInfo) {
      throw new Error('The user has not been registered to a channel');
    }
    return channelInfo;
  }

  
  async getChannels(): Promise<BaseChannel> {
    const channels =  await this.getDocuments(this._docPath)

    if (!channels[0]) {
      throw new Error('The user has not been registered to any channel');
    }
    return channels[0];
  }
  
}
