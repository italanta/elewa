import { HandlerTools } from '@iote/cqrs';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for writing and reading blocks information
 */
export class SurveysDataService extends BotDataService<Connection> 
{
  private _docPath: string;
  private tools: HandlerTools;

  constructor(private _channel: CommunicationChannel, tools: HandlerTools) 
  {
    super(tools);
    this._docPath= `orgs/${_channel.orgId}/surveys`
    this.tools = tools;
  }

  private _getSurvey(id: string)
  {
    return this.getDocumentById(id, this._docPath);
  }
}
