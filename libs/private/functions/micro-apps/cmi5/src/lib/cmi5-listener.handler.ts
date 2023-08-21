import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200 } from '@ngfi/functions'
;
import { CMI5Service } from './lms.service';
import { CMI5AUService } from './au.service';

/**
 * cmi5 is a “profile” for using the xAPI specification with traditional learning 
 *    management (LMS) systems.
 * 
 * Since the xAPI specification is highly generalized to support many different use 
 *    cases, a set of “extra rules” (called a “profile”) is needed to ensure interoperability
 *       for a given use case. The cmi5 profile ensures plug and play interoperability between 
 *          learning content and LMS systems.
 * 
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#concept
 * 
 * This handler is a listener for xAPI requests sent by the AU
 * @see https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#endpoint
 * 
 * xAPI requests in this case come in form of query params to the the url endpoint of this function
 * 
 * The CLM is referred to as the LMS here.
 */
export class CMI5Listener extends FunctionHandler<any, { }>
{
  /**
   * The AU assumes the endpoint(this functions's URL) represents a base url for all the 
   *    subsequent requests. Therefore it will send requests to specific endpoints added 
   *      to the base URL e.g. '{functionURL}/activities/state' when requesting for the state
   *        data
   * 
   * Therefore we extract the path from the request and use it to 
   *    determine how to handle the xAPI request.
   */
  public async execute(req: any, context: any, tools: HandlerTools)
  {
    // Get the request data and the URL path
    const path = context.request.path;
    const queryData = context.request.query;
    const orgId = queryData.agent.account.organisation;
    const endUserId = queryData.agent.account.endUserId;

    // Initialize the CMI5 Service.
    //
    //  Defines the processes of the CMI5 specification as
    // defined in the concept overview
    const lms = new CMI5Service(tools);
    
    // Change the process to do depending on the url endpoint path
    switch (path) {
      case '/activities/state':
        
        // Gets the state document
        const stateDocument = await lms.getStateDocument(orgId ,queryData.activityId);
        
        return stateDocument;
      case '/agents/profile':
      // Get the learner preferences document
      const learnerPreferences = await lms.getLearnerPreferences(orgId, endUserId);
      
      return learnerPreferences;

    case '/activities':
    const auService = new CMI5AUService(tools);
  
    return learnerPreferences;
      default:
        break;
    }

    return {success: true} as RestResult200;
  }

}