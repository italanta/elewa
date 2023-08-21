import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200 } from '@ngfi/functions'
;
import { CMI5LMSService } from './lms.service';
import { AUService } from './au.service';

export class CMI5Listener extends FunctionHandler<any, { }>
{
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: any, context: any, tools: HandlerTools)
  {
    const path = context.request.path;
    const queryData = context.request.query;
    const orgId = queryData.agent.account.organisation;
    const endUserId = queryData.agent.account.endUserId;

    
    const lms = new CMI5LMSService(tools);
    
    switch (path) {
      case '/activities/state':
        
        
        const stateDocument = await lms.getStateDocument(orgId ,queryData.activityId);
        
        return stateDocument;
      case '/agents/profile':
      
      const learnerPreferences = await lms.getLearnerPreferences(orgId, endUserId);
      
      return learnerPreferences;

    case '/activities':
    const auService = new AUService(tools);
  
    return learnerPreferences;
      default:
        break;
    }

    return {success: true} as RestResult200;
  }

}