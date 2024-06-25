import { isString as ___isString } from 'lodash';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { InitMicroAppCmd, InitMicroAppResponse, MicroAppStatus, MicroAppStatusTypes } from '@app/model/convs-mgr/micro-app/base';

/**
 * Handler responsible for initiation micro-apps based on the passed micro-app ID.
 */
export class InitMicroAppHandler extends FunctionHandler<InitMicroAppCmd, InitMicroAppResponse>
{
  public async execute(req: InitMicroAppCmd, context: FunctionContext, tools: HandlerTools): Promise<InitMicroAppResponse>
  {
    tools.Logger.log(() => `Initiation micro-app with ID ${req.appId}`)
    req = ___isString(req) ? JSON.parse(req) : req;

    try 
    {
      const appRegistrationRepo$ =  tools.getRepository<MicroAppStatus>(`appExecs`);
      const app = await appRegistrationRepo$.getDocumentById(req.appId);

      // Case - App does not exists
      if(!app)
        throw (`Cannot find a running app for ID ${req.appId}`);

      // Case - App was already completed
      if(app.status === MicroAppStatusTypes.Completed)
        return { success: false, app };

      // Normal case - Initialise app
      // Start the micro-app
      app.startedOn = Date.now();
      app.status = MicroAppStatusTypes.Started;
      await appRegistrationRepo$.update(app);

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


