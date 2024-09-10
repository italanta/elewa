import axios from "axios";

import { HandlerTools } from "@iote/cqrs";

import { CommunicationChannel, WhatsAppCommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { WhatsappCreateTemplate, WhatsappTemplateCategoryTypes } from "@app/model/convs-mgr/functions";
import { TemplateMessage } from "@app/model/convs-mgr/conversations/messages";

import { mapComponents } from "./map-template-components";
import { ManageTemplateResponse } from "../models/manage-template-response.interface";

export class ManageTemplateService 
{
  private _orgId: string;
  private _communicationChannel: CommunicationChannel;
  private baseURL = `https://graph.facebook.com/v20.0/`;

  constructor(communicationChannel: CommunicationChannel, private _tools: HandlerTools)
  {
    this._communicationChannel = communicationChannel;
    this._orgId = communicationChannel.id;
  }

  public async create(messageTemplate: TemplateMessage): Promise<ManageTemplateResponse> 
  {
    this._tools.Logger.log(()=> `[ManageTemplateService].create - Creating template: ${JSON.stringify(messageTemplate)}`);
    
    // Only for whatsapp
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;

    const createURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates`;

    const templatePayload = this._createTemplatePayload(messageTemplate);

    const headers = {
      'ContentType': 'application/json'
    }
  
    headers['Authorization'] = `Bearer ${whatsappCommChannel.accessToken}`;

    this._tools.Logger.log(() => `[ManageTemplateService].create - Attempting to post: ${JSON.stringify(templatePayload)}`);
    
    try {
      const response = await axios.post(createURL, templatePayload, {
        headers: headers
      });
      
      if (!response.data.error || response.data.success) {
        this._tools.Logger.log(()=> `[ManageTemplateService].create :: ${response.data}`);
        return {
          success: true,
          message: "Template Created Successfully",
          data: {
            ...response.data
          }
        } as ManageTemplateResponse;
      } else {
        
        this._tools.Logger.error(()=> `[ManageTemplateService].create - error:: ${response.data.error.message}`);
        this._tools.Logger.error(()=> `[ManageTemplateService].create - error:: ${response.data.error.error_user_msg}`);
        this._tools.Logger.error(()=> `[ManageTemplateService].create - error:: ${response.data.error}`);
        
        return { success: false, message:  response.data.error.error_user_msg || response.data.error.message ||  "Template failed to create"};
      }
    } catch (error) {
      this._tools.Logger.error(()=> `[ManageTemplateService].create - error:: ${error}`);
      return { success: false, message:  JSON.stringify(error)};
    }
  }
  
  public async update(messageTemplate: TemplateMessage): Promise<ManageTemplateResponse>  
  {
    this._tools.Logger.log(()=> `[ManageTemplateService].create - Updating template: ${JSON.stringify(messageTemplate)}`);
    
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;
    
    const updateURL = this.baseURL + `${messageTemplate.externalId}`;
    
    const components = mapComponents(messageTemplate, this._tools);
    
    const updatePayload = {
      category: messageTemplate.category,
      components
    };
    
    const headers = {
      'ContentType': 'application/json'
    }
    
    headers['Authorization'] = `Bearer ${whatsappCommChannel.accessToken}`
    
    this._tools.Logger.log(() => `[ManageTemplateService].update - Attempting to post: ${JSON.stringify(updatePayload)}`);

    try {
      const response = await axios.post(updateURL, updatePayload, {
        headers: headers
      });
  
      if (!response.data.error || response.data.success) {
        this._tools.Logger.log(()=> `[ManageTemplateService].update :: ${response.data}`);
        return { success: true };
      } else {
  
        this._tools.Logger.error(()=> `[ManageTemplateService].update - error:: ${response.data.error.message}`);
        this._tools.Logger.error(()=> `[ManageTemplateService].update - error:: ${response.data.error.error_user_msg}`);
        this._tools.Logger.error(()=> `[ManageTemplateService].update - error:: ${response.data.error}`);
        
        return { success: false, message:  response.data.error.error_user_msg || response.data.error.message};
      }
    } catch (error) {
      this._tools.Logger.error(()=> `[ManageTemplateService].update - error:: ${error}`);
      return { success: false, message:  JSON.stringify(error)};
    }
  }

  public async delete(name: string) 
  {
    const query = '?name='+name;

    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;

    const deleteURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates${query}`;

    this._tools.Logger.log(() => `[ManageTemplateService].delete - Attempting to delete template`);
    
    const headers = {
      'ContentType': 'application/json'
    }
    
    headers['Authorization'] = `Bearer ${whatsappCommChannel.accessToken}`
    
    try {
      const response = await axios.delete(deleteURL, {
        headers: headers
      });
      
      if (response.data.success) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      this._tools.Logger.error(()=> `[ManageTemplateService].delete - error:: ${error}`);
      return { success: false, message:  JSON.stringify(error)};
    }
  }
  
  public async getAll(fields?: string[], limit?: number) 
  {
    // Only for whatsapp
    const whatsappCommChannel = this._communicationChannel as WhatsAppCommunicationChannel;
    let getURL = this.baseURL + `${whatsappCommChannel.businessAccountId}/message_templates`;
    
    if (fields || limit) {
      getURL = getURL + this.buildQuery(fields, limit);
    }
    
    const headers = {
      'ContentType': 'application/json'
    }
    
    headers['Authorization'] = `Bearer ${whatsappCommChannel.accessToken}`

    this._tools.Logger.log(() => `[ManageTemplateService].getAll - Attempting to fetch templates`);
    
    try {
      const response = await axios.get(getURL, {
        headers: headers
      });
  
      if(response.data.data) {
        return {
          success: true,
          templates: response.data.data
        }
      } else {
        return {
          success: false,
          error: response.data.error || "Failed to fetch templates"
        }
      }
    } catch (error) {
      this._tools.Logger.error(()=> `[ManageTemplateService].getAll - error:: ${error}`);
      return { success: false, error:  JSON.stringify(error)};
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

  private _createTemplatePayload(messageTemplate: TemplateMessage) 
  {
    const templateComponents = mapComponents(messageTemplate, this._tools);

    const whatsappMessageTemplate: WhatsappCreateTemplate = {
      // Allow whatsapp review team to automatically change the category
      //  in case the template has been miscategorized to avoid
      //    being rejected.
      allow_category_change: true,
      name: messageTemplate.name,
      language: messageTemplate.language,
      category: messageTemplate.category as unknown as WhatsappTemplateCategoryTypes,
      components: templateComponents
    };

    return whatsappMessageTemplate;
  }
}