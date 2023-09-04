import { HandlerTools } from '@iote/cqrs';

import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class VariablesDataService extends BotDataService<any>{
  private _docPath: string;
  tools: HandlerTools;
  endUserId: string;

  constructor(tools: HandlerTools, orgId: string, endUserId: string) 
  {
    super(tools);
    this.tools = tools;
    this._init(orgId, endUserId);
  }

  protected _init(orgId: string, endUserId:string): void 
  {
    this._docPath = `orgs/${orgId}/end-users`;

    this.endUserId = endUserId;
  }

  public getAllVariables(endUser: EndUser) {
    return {
      ...endUser,
      ...endUser.variables
    }
  }
}
