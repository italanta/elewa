import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { DialogflowCXIntent } from '@app/model/convs-mgr/fallbacks';

import { IntentService } from '../services/intent.service';
/**
 * @Description : Used to create module intents
 */
export class CreateIntentHandler extends FunctionHandler<DialogflowCXIntent, RestResult | DialogflowCXIntent>
{
  private _intentService: IntentService;
  public async execute(req: DialogflowCXIntent, context: HttpsContext, tools: HandlerTools) 
  { 
    this._intentService = new IntentService();
    tools.Logger.log(() => `[CreateIntentHandler] - Creating Intent: ${JSON.stringify(req)}`);
    try {
      await this._intentService.init(req, tools);

      return await this._intentService.createIntent(req, tools);
    } catch (e){
      tools.Logger.log(() => `[CreateIntentHandler] - Error Creating Intent: ${JSON.stringify(e)}`);
      return { status: 500, message: e.message } as RestResult;
    }
  }
}