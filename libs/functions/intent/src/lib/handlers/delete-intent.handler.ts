import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

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
    tools.Logger.log(() => `[DeleteIntentHandler] - Deleting Intent: ${JSON.stringify(req)}`);
    try {
      await this._intentService.init(req, tools);
      const deleteResult = await this._intentService.deleteIntent(req, tools);
      return { status: 200, message: deleteResult } as unknown as RestResult;
    } catch (e){
      tools.Logger.log(() => `[DeleteIntentHandler] - Error Deleting Intent: ${JSON.stringify(e)}`);
      return { status: 500, message: e.message } as RestResult;
    }
  }
}