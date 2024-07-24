import { isString as ___isString } from 'lodash';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { InitMicroAppCmd, InitMicroAppResponse, MicroAppStatus, MicroAppStatusTypes, MicroAppTypes } from '@app/model/convs-mgr/micro-app/base';

import { EngineBotManager } from '@app/functions/bot-engine';
import { ___DirectChannelFactory } from '@app/functions/bot-engine/channels';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';

import { AssessmentProgressService } from './assessments/assessment-progress.service';

/**
 * Handler responsible for completing a micro-app.
 * Communicates with Goomza middleware so functions may continue.
 */
export class CompleteMicroAppHandler extends FunctionHandler<InitMicroAppCmd, InitMicroAppResponse>
{
  public async execute(req: InitMicroAppCmd, context: FunctionContext, tools: HandlerTools): Promise<InitMicroAppResponse>
  {
    tools.Logger.log(() => `Completing micro-app with ID ${req.appId}`)
    req = ___isString(req) ? JSON.parse(req) : req;

    try 
    {
      const appRegistrationRepo$ =  tools.getRepository<MicroAppStatus>(`appExecs`);
      const app = await appRegistrationRepo$.getDocumentById(req.appId);

      // Case - App does not exists
      if(!app)
        throw (`Cannot find a running app for ID ${req.appId}`);

      // Complete the micro-app
      app.finishedOn = Date.now();
      app.status = MicroAppStatusTypes.Completed;
      await appRegistrationRepo$.update(app);

      // Send an update message to the user over the channel in which the thing was started
      const channel = app.config.channel;
      
      const activeChannel = ___DirectChannelFactory(channel, tools);

      const endUserRepo$ = tools.getRepository<EndUser>(`orgs/${app.config.orgId}/end-users`);
      const endUser = await endUserRepo$.getDocumentById(app.endUserId);

      // If the type is an assessment, we send the pdf before we resume the flow
      if(app.config.type === MicroAppTypes.Assessment) {
        const assessmentProgressSrv = new AssessmentProgressService(tools);

        const progress = await assessmentProgressSrv.getCurrentProgress(app.config.orgId, app.endUserId, app.appId);

        await assessmentProgressSrv.sendPDF(progress, tools, channel);
      }

      const continueGoomzaFlow = new EngineBotManager(tools, tools.Logger, activeChannel);
      // TODO: await continueGoomzaFlow.run({ } as MicroAppSuccessMessage OR AssessmentCompleteMessage [subtype of MicroAppSuccessMessage], )    
      await continueGoomzaFlow.run(null, endUser);
      
      return { success: true, app };
      
    } 
    catch (error) {
      tools.Logger.error(() => `[InitMicroAppHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return {
        success: false,
        error: JSON.stringify(error)
      } as InitMicroAppResponse;
    }
  }

}


