import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class ConnectionsDataService extends BotDataService<Connection> 
{
  private _docPath: string;
  private _channel: CommunicationChannel;

  constructor(channel: CommunicationChannel, tools: HandlerTools) 
  {
    super(tools);
    this._init(channel);
  }

  protected _init(channel: CommunicationChannel)
  {
    this._docPath = `orgs/${channel.orgId}/stories/${channel.defaultStory}/connections`;
    this._channel = channel;
  }


  /** 
   * Each connection we store has the sourceId which contains the block the connection comes from
   * 
   * Gets the connection whose source matches the id of the option selected by the user
   *  This function is used to get the next block linked by the option in a QuesionMessageBlock
   * 
   * @note We can know if the user input is invalid if the connection is not found (conn == null)
   */
  async getConnByOption(optionId: string): Promise<Connection>
  {

    const conn = await this.getDocumentByField('sourceId', optionId, this._docPath);

    return conn[0];
  }

  /** 
   * Each connection we store has the sourceId which contains the block the connection comes from
   * 
   * Gets the connection whose source matches the block id provided 
   *  This function is used to get the next block linked in a block with only the default option
   * 
   * @note We can know if the block is the last one if no connection originates from it (conn == null)
   */
  async getConnBySourceId(blockId: string): Promise<Connection>
  {

    const conn = await this.getDocumentByField('sourceId', `defo-${blockId}`, this._docPath);

    return conn[0];
  }

  /** Gets the connection that links the anchor block and the first block */
  async getFirstConn(): Promise<Connection>
  {

    const conn = await this.getDocumentByField('sourceId', `${this._channel.defaultStory}`, this._docPath);

    if (!conn[0])
    {
      throw new Error('First Connection does not exist');
    }

    return conn[0];
  }
}
