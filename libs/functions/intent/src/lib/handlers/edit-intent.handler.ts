import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

import { IntentService } from '../services/intent.service';

/**
 * @Description : Used to edit module intents
 */
export class EditIntentHandler extends FunctionHandler<DialogflowCXIntent, RestResult | DialogflowCXIntent>
{
  private _intentService: IntentService;
  public async execute(req: DialogflowCXIntent, context: HttpsContext, tools: HandlerTools) 
  { 
    this._intentService = new IntentService();
    tools.Logger.log(() => `[EditIntentHandler] - Editing Intent: ${JSON.stringify(req)}`);
    try {
      return await this._intentService.updateIntent(req, tools);
    } catch (e){
      tools.Logger.log(() => `[CreateIntentHandler] - Error Creating Intent: ${JSON.stringify(e)}`);
      return { status: 500, message: e.message } as RestResult;
    }
  }
}