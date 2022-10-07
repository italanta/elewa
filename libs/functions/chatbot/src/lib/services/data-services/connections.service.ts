import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class ConnectionsDataService extends BotDataService<Connection> {
  private _docPath: string;
  private _msg: BaseMessage;

  constructor(msg: BaseMessage, tools: HandlerTools) 
  {
    super(tools)
    this._init(msg)
  }

  protected _init(msg: BaseMessage){
    this._docPath = `orgs/${msg.orgId}/stories/${msg.storyId}/connections`
    this._msg = msg
  }


  async getConnByOption(optionId: string): Promise<Connection> {

    const conn = await this.getDocumentByField('sourceId', optionId, this._docPath)

    if (!conn[0]) {
      throw new Error('Connection does not exist');
    }

    return conn[0];
  }

  /** Gets the connection whose source matches the block id provided */
  async getConnBySourceId(blockId: string): Promise<Connection> {

    const conn = await this.getDocumentByField('sourceId', `defo-${blockId}`, this._docPath)

    if (!conn[0]) {
      throw new Error('Connection does not exist');
    }

    return conn[0];
  }

  /** Gets the connection that links the anchor block and the first block */
  async getFirstConn(): Promise<Connection> {

    const conn = await this.getDocumentByField('sourceId', `${this._msg.storyId}`, this._docPath)

    if (!conn[0]) {
      throw new Error('First Connection does not exist');
    }

    return conn[0];
  }
}
