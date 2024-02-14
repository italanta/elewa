import { HandlerTools } from "@iote/cqrs";

import { HttpService } from "@app/functions/bot-engine";
import { CommunicationChannel, WhatsAppCommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { MessageTemplate, WhatsappCreateTemplate } from "@app/model/convs-mgr/functions";

import { mapComponents } from "./map-template-components";
import { ManageTemplateResponse } from "../models/manage-template-response.interface";

export class ManageTemplateService 
{
  private _orgId: string;
  private _communicationChannel: CommunicationChannel;
  private baseURL = `https://graph.facebook.com/v18.0/`;
  private httpService = new HttpService();

  constructor(communicationChannel: CommunicationChannel, private _tools: HandlerTools)
  {
    this._communicationChannel = communicationChannel;
    this._orgId = communicationChannel.id;
  }

  public async create(messageTemplate: MessageTemplate): Promise<ManageTemplateResponse> 
  {
    this._tools.Logger.log(()=> `[ManageTemplateService].create - Creating template: ${JSON.stringify(messageTemplate)}`);
    
    // Only for whatsapp
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;

    const createURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates`;

    const templatePayload = this._createTemplatePayload(messageTemplate);

    const response = await this.httpService.httpPost(createURL, templatePayload, whatsappCommChannel.accessToken, this._tools)

    if (response) {

      return {
        success: true,
        message: "Template Created Successfully",
        data: {
          ...response
        }
      } as ManageTemplateResponse;
    } else {
      return {
        success: false,
        message: "Template failed to create"
      };
    }
  }

  public async update(messageTemplate: MessageTemplate): Promise<ManageTemplateResponse>  
  {
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;

    const updateURL = this.baseURL + `${messageTemplate.templateId}`;

    const components = mapComponents(messageTemplate, this._tools);

    const updatePayload = {
      category: messageTemplate.category,
      components
    };

    const response = await this.httpService.httpPost(updateURL, updatePayload, whatsappCommChannel.accessToken, this._tools);

    if (response) {
      return { success: true };
    } else {
      return { success: false };
    }
  }

  public async delete(name: string) 
  {
    const query = '?name='+name;

    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;

    const deleteURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates${query}`;

    const response = await this.httpService.delete(deleteURL, this._tools, whatsappCommChannel.accessToken);

    if (response) {
      return { success: true };
    } else {
      return { success: false };
    }
  }

  public async getAll(fields?: string[], limit?: number) 
  {
    // Only for whatsapp
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;
    let updateURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates`;

    if (fields || limit) {
      updateURL = updateURL + this.buildQuery(fields, limit);
    }

    const response = await this.httpService.get(updateURL, this._tools, whatsappCommChannel.accessToken);

    if(response.data) {
      return {
        templates: response.data
      }
    } else {
      return {
        error: response.error || "Failed to fetch templates"
      }
    }
  }

  private buildQuery(fields?: string[], limit?: number)
  {
    let query = '';

    if ((typeof fields) == "object" && !limit) {
      query = '?fields=' + fields.join(',');

    } else if (!fields && (typeof limit) == "number") {
      query = '?limit=' + limit;

    } else if (fields && limit) {
      query = '?fields=' + fields.join(',') + '&limit=' + limit;
    }

    return query;
  }

  private _createTemplatePayload(messageTemplate: MessageTemplate) 
  {
    const templateComponents = mapComponents(messageTemplate, this._tools);

    const whatsappMessageTemplate: WhatsappCreateTemplate = {
      // Allow whatsapp review team to automatically change the category
      //  in case the template has been miscategorized to avoid
      //    being rejected.
      allow_category_change: true,
      name: messageTemplate.name,
      language: messageTemplate.language,
      category: messageTemplate.category,
      components: templateComponents
    };

    return whatsappMessageTemplate;
  }
}