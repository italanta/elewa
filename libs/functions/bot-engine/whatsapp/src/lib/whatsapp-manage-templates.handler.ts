import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler } from '@ngfi/functions';

import { ManageTemplateRequest } from './models/manage-templates-request.interface';
import { ManageTemplateResponse } from './models/manage-template-response.interface';

export class WhatsappManageTemplatesAPI extends FunctionHandler<ManageTemplateRequest, ManageTemplateResponse>
{
  public async execute(req: ManageTemplateRequest, context: any, tools: HandlerTools) 
  {
    return {} as any;
  }
}
