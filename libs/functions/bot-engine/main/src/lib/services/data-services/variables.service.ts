import { HandlerTools } from '@iote/cqrs';

import { VariableMessage } from '@app/model/convs-mgr/conversations/messages';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class VariablesDataService extends BotDataService<VariableMessage> {
  private _docPath: string;
  private _var: VariableMessage;

  constructor(tools: HandlerTools) {
    super(tools)
  }

  /**
   * Stores the standardized message format to the database.
   * 
   * Assigns an id to the variable if it is not yet set before this point
   */
  async saveVariable(msg: VariableMessage, orgId: string, endUserId: string): Promise<VariableMessage> {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/response-data`

    // If the variable id is not set, we set it here
    msg.id! && (msg.id = Date.now().toString())

    // Create the variable document with the timestamp as the id
    const savedVariable = await this.createDocument(msg, this._docPath, msg.id)

    return savedVariable;
  }

  async getLatestVariable(endUserId: string, orgId: string): Promise<VariableMessage> {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/response-data`

    const latestVariable = await this.getLatestDocument(this._docPath);

    return latestVariable[0];
  }
}
