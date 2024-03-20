import { HandlerTools } from '@iote/cqrs';

import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class VariablesDataService extends BotDataService<any>{
  private _docPath: string;
  tools: HandlerTools;
  endUserId: string;

  constructor(tools: HandlerTools, orgId: string, endUserId: string, private _commChannel: CommunicationChannel) 
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
    // Get channel details and include them in variables

    const channelDetails = {
      channelName: this._commChannel.name,
      botPhoneNumber: this._commChannel['phoneNumber'] || null,
      platform: this._commChannel.type
    }
    
    return {
      ...endUser,
      ...channelDetails,
      ...endUser.variables,
    }
  }

  public async getSpecificVariable(endUserId: string, variable: string) {
    const endUserRepo$ = this.tools.getRepository<EndUser>(this._docPath);

    const endUser = await endUserRepo$.getDocumentById(endUserId);

    const allVariables = this.getAllVariables(endUser);

    return allVariables[variable];
  }
}
