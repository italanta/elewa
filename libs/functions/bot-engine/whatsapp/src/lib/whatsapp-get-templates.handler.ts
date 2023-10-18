import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler } from '@ngfi/functions';

import { ChannelDataService } from '@app/functions/bot-engine';

import { ManageTemplateService } from './services/manage-template-service.class';

export class WhatsappGetTemplatesHandler extends FunctionHandler<{ fields: string[], limit: number, channelId: string}, any>
{
  public async execute(req: { fields: string[], limit: number, channelId: string}, context: any, tools: HandlerTools) 
  {
    // Get channel Information
    const channelService = new ChannelDataService(tools);

    const communicationChannel = await channelService.getChannelInfo(req.channelId);

    // Initialize the template service
    const manageTemplateService = new ManageTemplateService(communicationChannel, tools);

    // Return all templates
    return manageTemplateService.getAll(req.fields, req.limit);
  }
}
