import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler } from '@ngfi/functions';

import { ChannelDataService } from '@app/functions/bot-engine';

import { ActionTypes, ManageTemplateRequest } from './models/manage-templates-request.interface';
import { ManageTemplateResponse } from './models/manage-template-response.interface';
import { ManageTemplateService } from './services/manage-template-service.class';

export class WhatsappManageTemplatesAPI extends FunctionHandler<ManageTemplateRequest, ManageTemplateResponse>
{
  public async execute(req: ManageTemplateRequest, context: any, tools: HandlerTools) 
  {
    try {
          // Get channel
    const channelService = new ChannelDataService(tools);

    const communicationChannel = await channelService.getChannelInfo(req.channelId);

    const manageTemplateService = new ManageTemplateService(communicationChannel, tools);

    switch (req.action) {
      case ActionTypes.Create:
        return manageTemplateService.create(req.template);
      case ActionTypes.Update:
        return manageTemplateService.update(req.template);
      case ActionTypes.Delete:
        return manageTemplateService.delete(req.template.name);
      default:
        return manageTemplateService.update(req.template);
    }
    } catch (error) { 
      tools.Logger.log(()=> `[WhatsappManageTemplatesAPI].execute - Encoutered error: ${error}`)
      return { success: false, message: error } as ManageTemplateResponse;
    }
  }
}
