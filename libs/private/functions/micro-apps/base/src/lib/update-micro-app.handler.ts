import { isString as ___isString } from 'lodash';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { InitMicroAppResponse, MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';

/**
 * Handler responsible for initiation micro-apps based on the passed micro-app ID.
 */
export class UpdateMicroAppHandler extends FunctionHandler<MicroAppStatus, InitMicroAppResponse>
{
  public async execute(req: MicroAppStatus, context: FunctionContext, tools: HandlerTools): Promise<InitMicroAppResponse>
  {
    tools.Logger.log(() => `Updating micro-app ${JSON.stringify(req)}`)
    req = ___isString(req) ? JSON.parse(req) : req;

    try 
    {
      const appRegistrationRepo$ =  tools.getRepository<MicroAppStatus>(`appExecs`);
      const app = await appRegistrationRepo$.update(req);

      return { success: true, app };
      
    } 
    catch (error) {
      tools.Logger.error(() => `[UpdateMicroAppHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return {
        success: false,
        error: JSON.stringify(error)
      } as InitMicroAppResponse;
    }
  }

}


