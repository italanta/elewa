import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

import { IntentService } from '../services/intent.service';

/**
 * @Description : Used to get appropriate module intents
 */

export class GetIntentHandler extends FunctionHandler<DialogflowCXIntent, RestResult | DialogflowCXIntent>
{
  private _intentService: IntentService;
  public async execute(req: DialogflowCXIntent, context: HttpsContext, tools: HandlerTools) 
  { 
    this._intentService = new IntentService();
    tools.Logger.log(() => `[CreateIntentHandler] - Creating Intent: ${JSON.stringify(req)}`);
    try {
      /** Write intent to org and module */
      const org = req.orgId;
      const module = req.botId;
      await this._intentService.init(req, tools);
      
      const intents = await this._intentService.getModuleIntents(req.orgId, req.botId, tools);
      return {
        status: 200,
        message: intents
      } as unknown as RestResult;
    } catch (e){
      tools.Logger.log(() => `[CreateIntentHandler] - Error Getting Intent: ${JSON.stringify(e)}`);
      return { status: 500, message: e.message } as RestResult;
    }
  }
}