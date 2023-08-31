import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, RestResult200 } from '@ngfi/functions';

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
export class CMI5Listener extends FunctionHandler<any, any>
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
    let orgId: string;
    let endUserId: string;

    context = context.eventContext;

    // Get the request data and the URL path
    const path = context.request.path as string;
    const body = context.request.body;
    const queryData = context.request.query;

    tools.Logger.log(() => `[CMI5Listener].execute - Request path: ${path}`);

    tools.Logger.log(() => `[CMI5Listener].execute - Request body: ${JSON.stringify(body)}`);

    tools.Logger.log(() => `[CMI5Listener].execute - Request query: ${JSON.stringify(queryData)}`);

    const lms = new CMI5Service(tools);

    // If the agent object is included in the quesry, get the orgId and endUserid
    if (queryData.agent) {
      queryData.agent = JSON.parse(queryData.agent);

      orgId = queryData.agent.account.homePage;

      endUserId = queryData.agent.account.name;

      if (path == '/activities/state') {

        await lms.prepareForLaunch(orgId, endUserId, queryData.activityId);
      }
    }

    // Initialize the CMI5 Service.
    //
    //  Defines the processes of the CMI5 specification as
    // defined in the concept overview


    // Change the process to do depending on the url endpoint path
    switch (path) {
      case '/activities/state':

        // Gets the state document
        const stateDocument = await lms.getStateDocument(orgId, queryData.activityId);

        tools.Logger.log(() => `[CMI5Listener].execute - State document: ${JSON.stringify(stateDocument)}`);

        return stateDocument;

      case '/agents/profile':
        // Temporarily send default learning preferences.
        // TODO: fetch actual learner preferences
        return {
          "languagePreference": "en-US",
          "audioPreference": "on"
        };

      case '/activities':
        const auService = new CMI5AUService(tools);

      case '/statements':
        tools.Logger.log(() => `[CMI5Listener].execute - API statement received`);
        return { status: 200 } as RestResult;

      // return body as any;
      default:
        return { success: true } as RestResult200;
    }
  }

}