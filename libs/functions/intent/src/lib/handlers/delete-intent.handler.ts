import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

import { IntentService } from '../services/intent.service';

/**
 * @Description : Used to delete module intents
 * 
 * 
 */
export class DeleteIntentHandler extends FunctionHandler<DialogflowCXIntent, RestResult>
{
  private _intentService: IntentService;
  public async execute(req: DialogflowCXIntent, context: HttpsContext, tools: HandlerTools) 
  { 
    this._intentService = new IntentService();
    tools.Logger.log(() => `[CreateIntentHandler] - Creating Intent: ${JSON.stringify(req)}`);
    try {
      const deleteResult = await this._intentService.deleteIntent(req, tools);
      return { status: 200, message: deleteResult } as unknown as RestResult;
    } catch (e){
      tools.Logger.log(() => `[CreateIntentHandler] - Error Creating Intent: ${JSON.stringify(e)}`);
      return { status: 500, message: e.message } as RestResult;
    }
  }
}