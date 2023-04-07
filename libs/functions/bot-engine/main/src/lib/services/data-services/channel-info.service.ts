import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';
import { IncomingMessage } from '@app/model/convs-mgr/conversations/messages';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

/**
 * Contains all the required database flow methods for the ChannelInfo collection
 */
export class ChannelDataService extends BotDataService<CommunicationChannel> {
  private _docPath: string;
  private _msg: IncomingMessage;
  private tools: HandlerTools;
  
  constructor(tools: HandlerTools, msg?: IncomingMessage) 
  {
    super(tools)
    this.tools = tools
    this._init(msg)
  }

  protected _init(msg: IncomingMessage){

    this.tools.Logger.log(() => `[ChannelDataService]._init - Raw message ${JSON.stringify(msg)}`);

    this._docPath = `channels`
    this._msg = msg
  }

  /**
 * The IDs of incoming end-users are prepended following the format:
 *    `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
 *        organisation is making to the same platform. 
 * 
 * Therefore, with 'n', we can find the communication channel the in which to send/receive the user message
 */
   async getChannelByConnection(n: number) {
    // Get users
    // Takes longer than get by Id
    const channelInfo = await this.getDocumentByField('n', n, this._docPath)
    
    if (!channelInfo)
      this.tools.Logger.error(() => `[ChannelInfo].getChannelInfo - The user has not been registered to a channel`);


    this.tools.Logger.log(() => `[ChannelInfo].getChannelInfo - Channel Information acquired successfully: ${JSON.stringify(channelInfo[0])}`);

    return channelInfo[0];
  }
  
  async getChannelInfo(id: string) {
    // Get users
    // Takes longer than get by Id
    const channelInfo = await this.getDocumentById(id ,this._docPath)

    return channelInfo;
  }
  
  async getChannels(): Promise<CommunicationChannel> {
    const channels =  await this.getDocuments(this._docPath)

    if (!channels[0]) {
      throw new Error('The user has not been registered to any channel');
    }
    return channels[0];
  }
  
}
