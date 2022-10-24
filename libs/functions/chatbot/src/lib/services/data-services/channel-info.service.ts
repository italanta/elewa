import { HandlerTools } from '@iote/cqrs';

// import { BaseChannel } from '@app/model/bot/channel';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { BotDataService } from './data-service-abstract.class';
import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel, WhatsappChannel } from 'libs/model/bot/channel/src';

/**
 * Contains all the required database flow methods for the ChannelInfo collection
 */
export class ChannelDataService extends BotDataService<BaseChannel> {
  private _docPath: string;
  private _msg: RawMessageData;
  private tools: HandlerTools;
  
  constructor(msg: RawMessageData, tools: HandlerTools) 
  {
    super(tools)
    this.tools = tools
    this._init(msg)
  }

  protected _init(msg?: RawMessageData){

    this.tools.Logger.log(() => `[ChannelDataService]._init - Raw message ${JSON.stringify(msg)}`);

    this._docPath = `channels/${msg.platform}/accounts`
    this._msg = msg
  }


  async getChannelInfo(businessAccountId: string) {
    // Get users
    const channelInfo = await this.getDocumentById(businessAccountId, this._docPath)

    if (!channelInfo) {
      throw new Error('The user has not been registered to a channel');
    }

    this.tools.Logger.log(() => `[ChannelInfo].getChannelInfo - Channel Information acquired successfully: ${JSON.stringify(channelInfo)}`);

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
