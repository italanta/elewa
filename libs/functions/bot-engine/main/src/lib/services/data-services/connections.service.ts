import { HandlerTools } from '@iote/cqrs';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class ConnectionsDataService extends BotDataService<Connection> 
{
  private _docPath: string;
  private tools: HandlerTools;

  constructor(private _channel: CommunicationChannel, tools: HandlerTools) 
  {
    super(tools);
    this.tools = tools;
  }

  /** 
   * Each connection we store has the sourceId which contains the block the connection comes from
   * 
   * Gets the connection whose source matches the id of the option selected by the user
   *  This function is used to get the next block linked by the option in a QuesionMessageBlock
   * 
   * @note We can know if the user input is invalid if the connection is not found (conn == null)
   */
  async getConnByOption(optionId: string, orgId: string, currentStory: string): Promise<Connection>
  {
    this._docPath = `orgs/${orgId}/stories/${currentStory}/connections`;

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
  async getConnBySourceId(blockId: string, orgId: string, currentStory: string): Promise<Connection>
  {
    this._docPath = `orgs/${orgId}/stories/${currentStory}/connections`;

    const conn = await this.getDocumentByField('sourceId', `defo-${blockId}`, this._docPath);

    if(conn.length > 1) {
      this.tools.Logger.error(() => `More than one connection originating from this block ${blockId}`);

      this.tools.Logger.log(() => `Getting the last created connection`);

      // Return the last created connection
      const lastCreatedConnection = conn.reduce((prev, current) => {
        return (prev.createdOn > current.createdOn) ? prev : current
      });

      return lastCreatedConnection
    }

    return conn[0];
  }

    /** Gets the first connection of a different storys */
    async getFirstConnection(storyId: string): Promise<Connection>
    {
      this._docPath = `orgs/${this._channel.orgId}/stories/${storyId}/connections`;
      
      const conn = await this.getDocumentByField('sourceId', `${storyId}`, this._docPath);
  
      if (!conn[0])
      {
        throw new Error('First Connection does not exist');
      }
  
      return conn[0];
    }
}
