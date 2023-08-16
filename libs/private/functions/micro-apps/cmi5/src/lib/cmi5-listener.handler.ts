import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200, FunctionContext } from '@ngfi/functions';

export class CMI5Listener extends FunctionHandler<any, RestResult200>
{
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: any, context: FunctionContext, tools: HandlerTools)
  {

    return {success: true} as RestResult200;
  }

}